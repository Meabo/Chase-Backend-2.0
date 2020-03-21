"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@colyseus/schema");
class Player extends schema_1.Schema {
    constructor(pseudo_, lat, lon) {
        super();
        this.playerId = "";
        this.pseudo = pseudo_;
        this.lat = lat;
        this.lon = lon;
    }
    getPseudo() {
        return this.pseudo;
    }
    getLocation() {
        return [this.lat, this.lon];
    }
    getPlayerId() {
        return this.playerId;
    }
}
__decorate([
    schema_1.type("string")
], Player.prototype, "pseudo", void 0);
__decorate([
    schema_1.type("number")
], Player.prototype, "lat", void 0);
__decorate([
    schema_1.type("number")
], Player.prototype, "lon", void 0);
__decorate([
    schema_1.type("string")
], Player.prototype, "playerId", void 0);
exports.default = Player;