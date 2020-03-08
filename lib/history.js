"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@colyseus/schema");
const actionhistory_1 = require("../src/actionhistory");
const movehistory_1 = require("../src/movehistory");
class History extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.actions = new schema_1.ArraySchema();
        this.moves = new schema_1.ArraySchema();
    }
    addMove(gameId, playerId, prevLocation, newLocation, timestamp) {
        const move = new movehistory_1.default(gameId, playerId, prevLocation, newLocation, timestamp);
        this.moves.push(move);
    }
    addAction(gameId, playerId, action, payload) {
        this.actions.push(new actionhistory_1.default(gameId, playerId, action, payload));
    }
    getHistoryMoves() {
        return this.moves;
    }
    getHistoryActions() {
        return this.actions;
    }
    getHistory() {
        return { actions: this.actions, moves: this.moves };
    }
}
__decorate([
    schema_1.type([actionhistory_1.default])
], History.prototype, "actions", void 0);
__decorate([
    schema_1.type([movehistory_1.default])
], History.prototype, "moves", void 0);
exports.default = History;
