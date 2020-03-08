"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
const emitter_1 = require("../emitter/emitter");
class GameLobby extends colyseus_1.Room {
    // When room is initialized
    onInit(options) {
        this.setState({
            name: options.name,
            history: [],
            players: [],
            ready: []
        });
    }
    // Checks if a new client is allowed to join. (default: `return true`)
    requestJoin(options, isNew) {
        return true;
    }
    everyoneIsReady(clients, playersReady) {
        return clients.length === playersReady.length;
    }
    // Authorize client based on provided options before WebSocket handshake is complete
    /*onAuth(options) {
     */
    // When client successfully join the room
    onJoin(client, options, auth) {
        console.log(`${client.sessionId} join GameLobby.`);
        this.state.history.push(`${client.sessionId} joined GameLobby.`);
    }
    // When a client sends a message
    onMessage(client, data) {
        if (data.action === "ready") {
            if (this.state.ready.includes(data.pseudo)) {
                this.state.ready = this.state.ready.filter((pseudo) => pseudo !== data.pseudo);
            }
            else {
                this.state.ready.push(data.pseudo);
            }
            if (this.everyoneIsReady(this.clients, this.state.ready)) {
                emitter_1.eventBus.sendEvent("createGame", { name: this.state.name });
                this.broadcast({ action: "everyone_ready" });
            }
        }
        if (data.action === "leave") {
            this.onLeave(client, true);
        }
    }
    // When a client leaves the room
    onLeave(client, consented) {
        this.state.history.push(`${client.sessionId} left GameLobby.`);
    }
    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose() { }
}
exports.default = GameLobby;
