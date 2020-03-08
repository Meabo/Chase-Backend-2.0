"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AreaRepository_1 = require("./Adapters/AreaRepository");
const locationutils_1 = require("./utils/locationutils");
class Discover {
    constructor() {
        this.areaRepository = new AreaRepository_1.default();
    }
    initAreas(areas) {
        this.areaRepository.set(areas);
    }
    showGames(user, limit) {
        if (!user.getLocation())
            return "No Location";
        const filtered_games = this.areaRepository
            .getAll()
            .filter((area) => locationutils_1.distanceByLoc(user.getLocation(), area.getLocation()) <= limit);
        return filtered_games;
    }
}
exports.default = Discover;
