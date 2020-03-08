"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@colyseus/schema");
const location_1 = require("../src/location");
class Action extends schema_1.Schema {
    constructor(gameId, playerId, action, payload) {
        super();
        const { status, pseudo, pseudoStealed, location, timestamp } = payload;
        this.gameId = gameId;
        this.playerId = playerId;
        this.status = status;
        this.pseudo = pseudo;
        this.action = action;
        this.location = new location_1.Location(location[0], location[1]);
        this.timestamp = timestamp;
        if (action === "steal")
            this.pseudoStealed = pseudoStealed;
    }
    getAction() {
        return this.action;
    }
    getStatus() {
        return this.status;
    }
    getPseudo() {
        return this.pseudo;
    }
}
__decorate([
    schema_1.type("string")
], Action.prototype, "gameId", void 0);
__decorate([
    schema_1.type("string")
], Action.prototype, "playerId", void 0);
__decorate([
    schema_1.type("string")
], Action.prototype, "status", void 0);
__decorate([
    schema_1.type("string")
], Action.prototype, "pseudo", void 0);
__decorate([
    schema_1.type("string")
], Action.prototype, "action", void 0);
__decorate([
    schema_1.type("number")
], Action.prototype, "timestamp", void 0);
__decorate([
    schema_1.type(location_1.Location)
], Action.prototype, "location", void 0);
__decorate([
    schema_1.type("string")
], Action.prototype, "pseudoStealed", void 0);
exports.default = Action;
