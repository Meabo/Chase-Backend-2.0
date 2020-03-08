"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
const emitter_1 = require("../emitter/emitter");
const schema_1 = require("@colyseus/schema");
const area_1 = require("../area");
const history_1 = require("../history");
class State extends schema_1.Schema {
    constructor(area) {
        super();
        this.history = new schema_1.ArraySchema();
        this.area = area;
    }
}
__decorate([
    schema_1.type([history_1.default])
], State.prototype, "history", void 0);
__decorate([
    schema_1.type(area_1.default)
], State.prototype, "area", void 0);
class AreaRoom extends colyseus_1.Room {
    // When room is initialized
    onInit(options) {
        //let socketServerInstance = new SocketServer().getInstance();
        //console.log(this);
        this.setState(new State(options.area));
    }
    // Checks if a new client is allowed to join. (default: `return true`)
    requestJoin(options, isNew) {
        return true;
    }
    // Authorize client based on provided options before WebSocket handshake is complete
    //onAuth(options) {}
    // When client successfully join the room
    onJoin(client, options, auth) {
        //console.log(`${client.sessionId} join Area.`);
        this.state.history.push(new history_1.default("join", client.sessionId, new Date().getTime()));
    }
    // When a client sends a message
    onMessage(client, data) {
        const { action, roomName } = data;
        switch (action) {
            case "getArea":
                this.send(client, this.state.area);
                break;
            case "joingameroom":
                emitter_1.eventBus.sendEvent("createGameLobby", data);
                this.onLeave(client, true);
                break;
        }
    }
    // When a client leaves the room
    onLeave(client, consented) {
        return __awaiter(this, void 0, void 0, function* () {
            this.state.history.push(new history_1.default("leave", client.sessionId, new Date().getTime()));
        });
    }
    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose() { }
}
exports.default = AreaRoom;
