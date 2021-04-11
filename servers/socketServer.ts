import app from "express";
import {createServer} from "http";
import {Server} from "colyseus";
import AreaRoom from "../src/socket-rooms/Rooms/arearoom";
import Discovery from "../src/socket-rooms/Rooms/discoveryroom";
import GameLobby from "../src/socket-rooms/Rooms/gamelobby";
import GameInstance from "../src/socket-rooms/Rooms/gameinstance";
import GameInstanceSolo from "../src/socket-rooms/Rooms/gameinstancesolo";

import {eventBus} from "../src/utils/emitter/emitter";

export const gameServer = new Server({
  server: createServer(app),
  verifyClient: (info, next) => {
    next(true);
    // validate 'info'
    // - next(false) will reject the websocket handshake
    // - next(true) will accept the websocket handshake
  }
});

export const methods = {
  getGameServer: () => gameServer,
  init: (areas) => {
     methods.createDiscoveryRoom(areas);
  },
  createDiscoveryRoom: (areas) => {
    try {
      gameServer.define("discovery", Discovery, {areas});
    } catch (err) {
      console.log("Error creating Discovery room", err);
    }
  },
  createGameLobby: (data) => {
    gameServer.define(data.name, GameLobby, data);
    console.log("Created Gamelobby");
  },
  createGame: (data) => {
    return new Promise((resolve, reject) => {
      gameServer.define(data.name, GameInstance, data)
      return resolve(true);
    })
  },
  createSoloGame: (name, options) => {
    try {
      gameServer.define(name, GameInstanceSolo, options);
      console.log("Solo game created");
    } catch (err) {
      console.log("Error creating Solo Game room", err);
    }
  }
};

eventBus.on("createGameLobby", (data) => {
  methods.createGameLobby(data);
});

eventBus.on("createGame", (data) => {
  methods.createGame(data);
});
