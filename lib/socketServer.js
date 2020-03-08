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
const express_1 = require("express");
const http_1 = require("http");
const colyseus_1 = require("colyseus");
const arearoom_1 = require("./rooms/arearoom");
const discoveryroom_1 = require("./rooms/discoveryroom");
const gamelobby_1 = require("./rooms/gamelobby");
const gameinstance_1 = require("./rooms/gameinstance");
const emitter_1 = require("./emitter/emitter");
exports.gameServer = new colyseus_1.Server({
    server: http_1.createServer(express_1.default),
    verifyClient: (info, next) => {
        next(true);
        // validate 'info'
        // - next(false) will reject the websocket handshake
        // - next(true) will accept the websocket handshake
    }
});
exports.methods = {
    getGameServer: () => exports.gameServer,
    init: (areas) => __awaiter(this, void 0, void 0, function* () {
        yield exports.methods.createDiscoveryRoom(areas);
        yield exports.methods.createAreasRoom(areas);
    }),
    createDiscoveryRoom: (areas) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.gameServer.register("discovery", discoveryroom_1.default, {
                areas
            });
        }
        catch (err) {
            console.log("Error creating Discovery room", err);
        }
    }),
    createAreasRoom: (areas) => __awaiter(this, void 0, void 0, function* () {
        if (areas) {
            areas.map((area) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield exports.gameServer.register(area.getName(), arearoom_1.default, {
                        area,
                        methods: this.methods
                    });
                }
                catch (err) {
                    console.log("Error creating Discovery room", err);
                }
            }));
        }
    }),
    createGameLobby: (data) => {
        exports.gameServer.register(data.name, gamelobby_1.default, data);
    },
    createGame: (data) => {
        exports.gameServer.register(data.name, gameinstance_1.default, data);
    }
};
emitter_1.eventBus.on("createGameLobby", (data) => {
    exports.methods.createGameLobby(data);
});
emitter_1.eventBus.on("createGame", (data) => {
    exports.methods.createGame(data);
});
