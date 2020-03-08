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
const player_1 = require("../player");
const area_1 = require("../area");
const locationutils_1 = require("../utils/locationutils");
describe("Location engine", () => {
    let player;
    let area;
    let bounds;
    const loc = [48.8556475, 2.2986304];
    const polygon = [[1, 1], [1, 2], [2, 2], [2, 1]];
    before(() => {
        player = new player_1.default("Mehdi", 48.8556475, 2.2986304);
        const top_left = [48.8569443, 2.2940138];
        const top_right = [48.8586221, 2.2963717];
        const bot_left = [48.8523546, 2.3012814];
        const bot_right = [48.8539637, 2.3035665];
        bounds = [top_left, top_right, bot_left, bot_right];
        area = new area_1.default(loc, bounds, "test");
    });
    it("Polygon: Point Inside the polygon, should return -1", () => __awaiter(this, void 0, void 0, function* () {
        chai_1.assert.equal(locationutils_1.robustPointInPolygon(polygon, [1.5, 1.5]), -1);
    }));
    it("Polygon: Point Outside the polygon, should return 1", () => __awaiter(this, void 0, void 0, function* () {
        chai_1.assert.equal(locationutils_1.robustPointInPolygon(polygon, [3, 3]), 1);
    }));
    it("Polygon: Point At the limit of the polygon, should return 0", () => __awaiter(this, void 0, void 0, function* () {
        chai_1.assert.equal(locationutils_1.robustPointInPolygon(polygon, [2, 2]), 0);
    }));
    it("Player: Should return -1 if a player is inside the area", () => __awaiter(this, void 0, void 0, function* () {
        chai_1.assert.equal(locationutils_1.robustPointInPolygon(area.getBounds(), player.getLocation()), -1);
    }));
    it("Player: Should return 1 if a player is outside the area", () => __awaiter(this, void 0, void 0, function* () {
        player = new player_1.default("Mehdi", 48.8514708, 2.2972489);
        chai_1.assert.equal(locationutils_1.robustPointInPolygon(area.getBounds(), player.getLocation()), 1);
    }));
    it("Robust Polygon tests", () => __awaiter(this, void 0, void 0, function* () {
        chai_1.assert.equal(locationutils_1.robustPointInPolygon(polygon, [1.5, 1.5]), -1);
        chai_1.assert.equal(locationutils_1.robustPointInPolygon(polygon, [1.2, 1.9]), -1);
        chai_1.assert.equal(locationutils_1.robustPointInPolygon(polygon, [0, 1.9]), 1);
        chai_1.assert.equal(locationutils_1.robustPointInPolygon(polygon, [1.5, 2]), 0);
        chai_1.assert.equal(locationutils_1.robustPointInPolygon(polygon, [1.5, 2.2]), 1);
        chai_1.assert.equal(locationutils_1.robustPointInPolygon(polygon, [3, 5]), 1);
        chai_1.assert.equal(locationutils_1.robustPointInPolygon(polygon, [1.5, 2]), 0);
        let newpolygon = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
        for (var j = 0; j < 3; ++j) {
            chai_1.assert.equal(locationutils_1.robustPointInPolygon(newpolygon, [0, 0]), -1);
            const subdiv = [];
            for (var i = 0; i < newpolygon.length; ++i) {
                const a = newpolygon[i];
                const b = newpolygon[(i + 1) % newpolygon.length];
                const c = [0.5 * (a[0] + b[0]), 0.5 * (a[1] + b[1])];
                subdiv.push(a, c);
                chai_1.assert.equal(locationutils_1.robustPointInPolygon(newpolygon, newpolygon[i]), 0);
                chai_1.assert.equal(locationutils_1.robustPointInPolygon(newpolygon, c), 0);
            }
            chai_1.assert.equal(locationutils_1.robustPointInPolygon(newpolygon, [1e10, 1e10]), 1);
            newpolygon = subdiv;
        }
    }));
    it("should give the distance 0 between 2 entities which are at the same pos", () => __awaiter(this, void 0, void 0, function* () {
        chai_1.assert.equal(locationutils_1.distance(0, 0, 0, 0), 0);
    }));
});
