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
const area_1 = require("../area");
const user_1 = require("../user");
const discover_1 = require("../discover");
describe("Discover", () => {
    const discover = new discover_1.default();
    const areas = [];
    let area;
    const userLoc = [48.850198, 2.2973423];
    const loc = [48.8556475, 2.2986304];
    before(() => __awaiter(this, void 0, void 0, function* () {
        const top_left = [48.8569443, 2.2940138];
        const top_right = [48.8586221, 2.2963717];
        const bot_left = [48.8523546, 2.3012814];
        const bot_right = [48.8539637, 2.3035665];
        area = new area_1.default(loc, [top_left, top_right, bot_left, bot_right], "test");
        areas.push(area);
        discover.initAreas(areas);
    }));
    it("should show one area according to the user's location  with a 1 km perimeter", () => __awaiter(this, void 0, void 0, function* () {
        const user_logged = new user_1.default("aboumehdi.pro@gmail.com");
        user_logged.setCurrentLocation(userLoc);
        const result = discover.showGames(user_logged, 1);
        chai_1.assert.deepEqual(area, result[0]);
    }));
    it("should show two areas according to the user's location with a 1 km perimeter", () => __awaiter(this, void 0, void 0, function* () {
        const user_logged = new user_1.default("aboumehdi.pro@gmail.com");
        user_logged.setCurrentLocation(userLoc);
        areas.push(area);
        discover.initAreas(areas);
        const result = discover.showGames(user_logged, 1);
        chai_1.assert.deepEqual(areas, result);
    }));
});
