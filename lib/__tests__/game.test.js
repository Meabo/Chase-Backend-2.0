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
const chai_1 = require("chai");
const game_1 = require("../game");
const results_1 = require("../results");
describe("Game Scenarios", () => {
    let game;
    let i = 1;
    const loc = [5, 5];
    const polygon = [[0, 0], [0, 10], [10, 10], [10, 0]];
    beforeEach(() => {
        const options = {
            chaseObjectLoc: [1, 1],
            gameId: i,
            arealoc: loc,
            bounds: polygon
        };
        game = new game_1.default(options);
        game.createPlayer("1", "player1", 0, 0);
        game.createPlayer("2", "player2", 0, 0);
        game.createPlayer("3", "player3", 0, 0);
        game.createPlayer("4", "player4", 0, 0);
        i++;
    });
    it("Scenario 1: Player 1 moves and catches the ChaseObject", () => __awaiter(this, void 0, void 0, function* () {
        game.movePlayer("1", { lat: 1, lon: 1 });
        game.movePlayer("2", { lat: 0, lon: 1 });
        game.movePlayer("3", { lat: 0, lon: 1 });
        game.movePlayer("4", { lat: 0, lon: 0 });
        const res2 = yield game.catchChaseObject("2");
        const res3 = yield game.catchChaseObject("3");
        const res4 = yield game.catchChaseObject("4");
        const res1 = yield game.catchChaseObject("1");
        chai_1.assert.equal(res1, true);
        chai_1.assert.equal(res2, false);
        chai_1.assert.equal(res3, false);
        chai_1.assert.equal(res4, false);
        chai_1.assert.equal(game.getGuardian().pseudo, "player1");
    }));
    it("Scenario 2: Player 1 moves and catches the ChaseObject, Player2 steals him", () => __awaiter(this, void 0, void 0, function* () {
        game.movePlayer("1", { lat: 1, lon: 1 });
        game.movePlayer("2", { lat: 0, lon: 1 });
        game.movePlayer("3", { lat: 0, lon: 1 });
        game.movePlayer("4", { lat: 0, lon: 0 });
        const res2 = yield game.catchChaseObject("2");
        const res3 = yield game.catchChaseObject("3");
        const res4 = yield game.catchChaseObject("4");
        const res1 = yield game.catchChaseObject("1");
        chai_1.assert.equal(res1, true);
        chai_1.assert.equal(res2, false);
        chai_1.assert.equal(res3, false);
        chai_1.assert.equal(res4, false);
        chai_1.assert.equal(game.getGuardian().pseudo, "player1");
        game.movePlayer("2", { lat: 1, lon: 1 });
        const resSteal = yield game.stealChaseObject("2");
        chai_1.assert.equal(resSteal, true);
        chai_1.assert.equal(game.getGuardian().pseudo, "player2");
    }));
    it("Scenario 3: Guardian Reset => Player 1 moves and catches the ChaseObject, Player2 steals him and exit the area, ChaseObject backs randomly in the map", () => __awaiter(this, void 0, void 0, function* () {
        const chaseobjectloc = game.getChaseObjectLocation();
        game.movePlayer("1", { lat: 1, lon: 1 });
        game.movePlayer("2", { lat: 0, lon: 1 });
        game.movePlayer("3", { lat: 0, lon: 1 });
        game.movePlayer("4", { lat: 0, lon: 0 });
        const res1 = yield game.catchChaseObject("1");
        chai_1.assert.equal(res1, true);
        game.movePlayer("2", { lat: 1, lon: 1 });
        const resSteal = yield game.stealChaseObject("2");
        chai_1.assert.equal(resSteal, true);
        chai_1.assert.equal(game.getGuardian().pseudo, "player2");
        game.movePlayer("2", { lat: 11, lon: 11 });
        chai_1.assert.notDeepEqual(chaseobjectloc, game.getChaseObjectLocation());
        chai_1.assert.equal(game.getGuardian(), null);
    }));
    it("Scenario 4: Announcing the winner and scoreboard", () => __awaiter(this, void 0, void 0, function* () {
        const chaseobjectloc = game.getChaseObjectLocation();
        game.movePlayer("1", { lat: 1, lon: 1 });
        game.movePlayer("2", { lat: 0, lon: 1 });
        game.movePlayer("3", { lat: 0, lon: 1 });
        game.movePlayer("4", { lat: 0, lon: 0 });
        const res1 = yield game.catchChaseObject("1");
        chai_1.assert.equal(res1, true);
        game.movePlayer("2", { lat: 1, lon: 1 });
        const resSteal = yield game.stealChaseObject("2");
        chai_1.assert.equal(resSteal, true);
        chai_1.assert.equal(game.getGuardian().pseudo, "player2");
        game.movePlayer("2", { lat: 1, lon: 1 });
        game.movePlayer("2", { lat: 2, lon: 2 });
        game.movePlayer("2", { lat: 3, lon: 3 });
        game.movePlayer("1", { lat: 3, lon: 3 });
        const resStealPlayer1 = yield game.stealChaseObject("1");
        game.movePlayer("3", { lat: 3, lon: 3 });
        game.movePlayer("1", { lat: 4, lon: 4 });
        const resStealPlayer3 = yield game.stealChaseObject("3");
        chai_1.assert.equal(resStealPlayer3, false);
        game.movePlayer("4", { lat: 4, lon: 4 });
        const resStealPlayer4 = yield game.stealChaseObject("4");
        chai_1.assert.equal(resStealPlayer4, true);
        chai_1.assert.equal(game.getGuardian().getPseudo(), "player4");
        const { totalCatchs, totalSteals, totalSkillsUsed } = results_1.getResults(game.getHistory());
        chai_1.assert.equal(totalCatchs, 1);
        chai_1.assert.equal(totalSteals, 3);
        chai_1.assert.equal(totalSkillsUsed, 0);
    }));
});
