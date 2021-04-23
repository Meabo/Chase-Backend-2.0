import {gm} from "../app";
import Discovery from "../src/socket-rooms/Rooms/discoveryroom";
import {GameLobby} from "../src/socket-rooms/Rooms/gamelobby";
import GameInstance from "../src/socket-rooms/Rooms/gameinstance";
import GameInstanceSolo from "../src/socket-rooms/Rooms/gameinstancesolo";
import {eventBus} from "../src/utils/emitter/emitter";

export const methods = {
  getGameServer: () => gm,
  init: (areas) => {
     methods.createDiscoveryRoom(areas);
  },
  createDiscoveryRoom: (areas) => {
    try {
      methods.getGameServer().define("discovery", Discovery, {areas});
    } catch (err) {
      console.log("Error creating Discovery room", err);
    }
  },
  createGameLobby: (data) => {
    methods.getGameServer().define(data.name, GameLobby, data);
    console.log("Created Gamelobby");
  },
  createGame: (data) => {
    return new Promise((resolve, reject) => {
      methods.getGameServer().define(data.name, GameInstance, data)
      return resolve(true);
    })
  },
  createSoloGame: (name, options) => {
    try {
      methods.getGameServer().define(name, GameInstanceSolo, options);
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
