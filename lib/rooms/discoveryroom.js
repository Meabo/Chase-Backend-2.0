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
const schema_1 = require("@colyseus/schema");
const area_1 = require("../area");
const history_1 = require("../history");
class State extends schema_1.Schema {
    constructor(areas) {
        super();
        this.history = new schema_1.ArraySchema();
        this.areas = new schema_1.ArraySchema();
        this.areas.push(...areas);
    }
}
__decorate([
    schema_1.type([history_1.default])
], State.prototype, "history", void 0);
__decorate([
    schema_1.type([area_1.default])
], State.prototype, "areas", void 0);
class Discovery extends colyseus_1.Room {
    // When room is initialized
    onInit(options) {
        this.setState(new State(options.areas));
    }
    onAuth(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return { success: true };
        });
    }
    // Checks if a new client is allowed to join. (default: `return true`)
    requestJoin(options, isNew) {
        return true;
    }
    // Authorize client based on provided options before WebSocket handshake is complete
    //onAuth(options) {}
    // When client successfully join the room
    onJoin(client, options, auth) {
        //console.log(`${client.sessionId} join Discovery.`);
        this.state.history.push(new history_1.default("join", client.sessionId, new Date().getTime()));
    }
    // When a client sends a message
    onMessage(client, data) {
        const { action, roomName } = data;
        switch (action) {
            case "getAreas":
                this.send(client, this.state.areas);
                break;
            case "leaveDiscovery":
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
exports.default = Discovery;
