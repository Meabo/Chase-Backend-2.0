"use strict";
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
const game_1 = require("../game");
class GameInstance extends colyseus_1.Room {
    // When room is initialized
    onInit(options) {
        this.setState(new game_1.default(options));
    }
    // Checks if a new client is allowed to join. (default: `return true`)
    requestJoin(options, isNew) {
        return true;
    }
    // Authorize client based on provided options before WebSocket handshake is complete
    /*onAuth(options) */
    // When client successfully join the room
    onJoin(client, options, auth) {
        //console.log(`${client.sessionId} join GameInstance.`);
        const { pseudo, lat, lon } = options;
        this.state.createPlayer(client.sessionId, pseudo, lat, lon);
    }
    // When a client sends a message
    onMessage(client, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { action, payload } = data;
            switch (action) {
                case "move":
                    this.state.movePlayer(client.sessionId, payload);
                    break;
                case "catch":
                    yield this.state.catchChaseObject(client.sessionId);
                    break;
                case "steal":
                    this.state.stealChaseObject(client.sessionId);
                    break;
            }
        });
    }
    // When a client leaves the room
    onLeave(client, consented) {
        this.state.removePlayer(client.sessionId);
    }
    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose() { }
}
exports.default = GameInstance;
