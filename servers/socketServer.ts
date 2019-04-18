import * as app from "express";
import {createServer} from "http";
import {Server} from "colyseus";
import AreaRoom from "../src/socket-rooms/arearoom";
import Discovery from "../src/socket-rooms/discoveryroom";
import GameLobby from "../src/socket-rooms/gamelobby";
import GameInstance from "../src/socket-rooms/gameinstance";
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

export const methods: any = {
  getGameServer: () => gameServer,
  init: async (areas) => {
    await methods.createDiscoveryRoom(areas);
    await methods.createAreasRoom(areas);
  },
  createDiscoveryRoom: async (areas) => {
    try {
      await gameServer.register("discovery", Discovery, {
        areas
      });
    } catch (err) {
      console.log("Error creating Discovery room", err);
    }
  },
  createAreasRoom: async (areas) => {
    if (areas) {
      areas.map(async (area) => {
        try {
          await gameServer.register(area.getName(), AreaRoom, {
            area,
            methods: this.methods
          });
        } catch (err) {
          console.log("Error creating Discovery room", err);
        }
      });
    }
  },
  createGameLobby: (data) => {
    gameServer.register(data.name, GameLobby, data);
  },
  createGame: (data) => {
    gameServer.register(data.name, GameInstance, data);
  }
};

eventBus.on("createGameLobby", (data) => {
  methods.createGameLobby(data);
});

eventBus.on("createGame", (data) => {
  methods.createGame(data);
});
