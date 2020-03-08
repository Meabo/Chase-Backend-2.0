"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@colyseus/schema");
const location_1 = require("./location");
class Move extends schema_1.Schema {
    constructor(gameId, playerId, prevLocation, newLocation, timestamp) {
        super();
        this.gameId = gameId;
        this.playerId = playerId;
        this.prevlocation = new location_1.Location(prevLocation[0], prevLocation[1]);
        this.newlocation = new location_1.Location(newLocation[0], newLocation[1]);
        this.timestamp = timestamp;
    }
    getPrevLocation() {
        return this.prevlocation.getLocation();
    }
    getNewLocation() {
        return this.newlocation.getLocation();
    }
    getPlayerId() {
        return this.playerId;
    }
}
__decorate([
    schema_1.type("string")
], Move.prototype, "gameId", void 0);
__decorate([
    schema_1.type("string")
], Move.prototype, "playerId", void 0);
__decorate([
    schema_1.type(location_1.Location)
], Move.prototype, "prevlocation", void 0);
__decorate([
    schema_1.type(location_1.Location)
], Move.prototype, "newlocation", void 0);
__decorate([
    schema_1.type("number")
], Move.prototype, "timestamp", void 0);
exports.default = Move;
