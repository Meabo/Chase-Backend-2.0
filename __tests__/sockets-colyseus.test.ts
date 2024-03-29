const port: number = 5000;
const socketUrl: string = `ws://localhost:${port}`;
import { Client, Room } from "colyseus.js";
import Area from "../src/area";
import { methods, gameServer } from "../servers/socketServer";
import sinon from "sinon";
import GameLobby from "../src/socket-rooms/gamelobby";
import Player from "../src/player";
import { PlayerLobby } from "../src/gamelobby";

const areas: Area[] = [];
const bounds: number[][] = [
  [48.8569443, 2.2940138],
  [48.8586221, 2.2963717],
  [48.8523546, 2.3012814],
  [48.8539637, 2.3035665],
];
const loc = [48.8556475, 2.2986304];

describe("Colyseus : Unit it on Events", () => {
  beforeAll(() => {
    const area = new Area("AreaA", [48.8556475, 2.2986304], bounds);
    const area1 = new Area("AreaB", [48.8556475, 2.2986304], bounds);
    areas.push(area, area1);
    methods.init(areas);
    gameServer.listen(port);
  });

  afterAll(() => {
    /* await new Promise((resolve, reject) => {
       console.log('Game server shut down')
       gameServer.gracefullyShutdown();
       resolve(true);
     }); */
     /*gameServer.gracefullyShutdown().then(() => {
       console.log('Game server shut down')
 
     })*/
   });
 

 
  describe("Basic Connection", () => {
    let client: Client;
    let room_client: Room;

    beforeEach(() => {
      client = new Client(socketUrl);
    });
    afterEach(() => {
      room_client.leave();
    });
    it("Should check that the socket is connected", (done) => {
      client
        .joinOrCreate("discovery")
        .then((room) => {
          room_client = room;
          done();
        })
        .catch((err) => {});
    });
  });
});

describe("Welcome to Discovery", () => {
  let player1: Client;
  let roomPlayer1: Room;
  beforeEach(() => {
    player1 = new Client(socketUrl);
  });

  afterEach(() => {
    roomPlayer1.leave();
  });

  it("Players should receive Areas in Discovery mode", async () => {
    roomPlayer1 = await player1.joinOrCreate("discovery");
    roomPlayer1.send({ action: "getAreas" });
    roomPlayer1.onMessage((areas_discovery) => {
      expect(areas_discovery).toHaveLength(2);
    });
  });
});

describe("Game Engine", () => {
  let player1: Client;
  let player2: Client;
  let roomPlayer1: Room;
  let roomPlayer2: Room;
  const roomName = "SuperGameBegins";

  beforeAll(async () => {
    const options = {
      name: roomName,
      chaseObjectLoc: [1, 1],
      arealoc: loc,
      bounds,
      gameId: "1",
      fetch: false,
    };
    await methods.createGame(options);
  });

  beforeEach(() => {
    player1 = new Client(socketUrl);
    player2 = new Client(socketUrl);
  });

 afterEach(() => {
    if (roomPlayer1 && roomPlayer2) {
      roomPlayer1.leave();
      roomPlayer2.leave();
      console.log('players in room left and room cleaned')
      //resolve();
    } else {
      const err = "Could not leave the room!";
      console.log(err);
      //reject(err);
    }
    /*return new Promise<void>((resolve, reject) => {
     
    });*/
  });

  it("Should receive player's update ", async () => {
    try {
      roomPlayer1 = await player1.joinOrCreate(roomName, {
        pseudo: "player1",
        lat: 5,
        lon: 5,
      });
      roomPlayer2 = await player2.join(roomName, {
        pseudo: "player2",
        lat: 1,
        lon: 1,
      });
      const expected_location = { lat: 1, lon: 1 };
      roomPlayer1.send({ action: "move", payload: expected_location });
      await new Promise((resolve) => setTimeout(resolve, 100));

      const player1_state: any = Object.values(roomPlayer2.state.players)[0];
      expect(player1_state.lat).toBe(expected_location.lat);
      expect(player1_state.lon).toBe(expected_location.lon);
    } catch (err) {
      console.log("Error", err);
    }
  });

  it("Should catch ChaseObject if a player is at the same location of the ChaseObject", async () => {
    try {
      roomPlayer1 = await player1.joinOrCreate(roomName, {
        pseudo: "player1",
        lat: 1,
        lon: 1,
      });

      roomPlayer2 = await player2.join(roomName, {
        pseudo: "player2",
        lat: 0,
        lon: 0,
      });

      roomPlayer1.send({ action: "catch" });

      const res = new Promise((resolve, reject) => {
        const listener = roomPlayer1.onStateChange((state) => {
          const guardian: string = state.guardian.pseudo;
          listener.clear();
          resolve(guardian);
        });
      })

      await expect(res).resolves.toBe("player1");

    } catch (err) {
      console.log("Catch error", err);
    }
  });

  it("Should steal ChaseObject if a player is at the same location of the guardian", async () => {
    try {
      roomPlayer1 = await player1.joinOrCreate(roomName, {
        pseudo: "player1_guardian",
        lat: 1,
        lon: 1,
      });

      console.log("steal join player 1 here");


      roomPlayer2 = await player2.join(roomName, {
        pseudo: "player2_stealer",
        lat: 1,
        lon: 1,
      });

      console.log("steal join player 2 here");

      roomPlayer1.send({ action: "catch" });

      const catchPlayer1 = new Promise((resolve, reject) => {
        const listener1 = roomPlayer1.onStateChange((state) => {
          console.log('state1 changed in room')
          const guardian: string = state.guardian.pseudo;
          console.log('guardian1', guardian)
          resolve(guardian);
          listener1.clear()
        });
      })

      await expect(catchPlayer1).resolves.toBe("player1_guardian");
      roomPlayer2.send({ action: "steal" });
      const stealPlayer2 = new Promise((resolve, reject) => {
        const listener2 = roomPlayer1.onStateChange((state) => {
          console.log('state2 changed in room')
          const guardian: string = state.guardian.pseudo;
          console.log('guardian2', guardian)
          resolve(guardian);
          listener2.clear();
        });
      });

      await expect(stealPlayer2).resolves.toBe("player2_stealer");
    } catch (err) {
      console.log(err);
    }
  }); 
}); 

/*
describe("Ready feature", () => {
  let room: GameLobby;
  let player1: Client;
  let player2: Client;
  let roomPlayer1: Room;
  let roomPlayer2: Room;
  let id = 0;
  let id_1 = 0;

  beforeAll(async () => {
    methods.createGameLobby({ name: "SuperGame" });

    player1 = new Client(socketUrl);
    player2 = new Client(socketUrl);
  });

  afterAll(async () => {
    return await new Promise((resolve, reject) => {
      roomPlayer1.leave();
      roomPlayer2.leave();
      resolve(true);
    });
  });

  it("Players ready in GameRoom", async () => {
    const room: Room = await player1.create("SuperGame");

    const onJoinStub = sinon
      .stub(GameLobby.prototype, "onJoin")
      .callsFake((client, options, auth) => {
        console.log(`${client.sessionId} join GameLobbyStub.`);
        client.id = `${id}`;
        room.state.players[client.id] = new PlayerLobby(
          client.id,
          "pseudo",
          "url"
        );
        room.state.creator_name = (room.state.players[
          Object.keys(room.state.players)[0]
        ] as PlayerLobby).pseudo;
        id++;
      });

    const onMessageStub = sinon
      .stub(GameLobby.prototype, "onMessage")
      .callsFake((client, data) => {
        const currentPlayer: PlayerLobby = room.state.players[client.id];
        currentPlayer.setReady(!currentPlayer.isReady());
        currentPlayer.isReady() ? room.state.counter++ : room.state.counter--;
        const numberOfPlayers = Object.keys(room.state.players).length;
        const numberOfPlayersThatAreReady = room.state.counter;

        const action =
          numberOfPlayers === numberOfPlayersThatAreReady
            ? "everyone_ready"
            : "everyone_not_ready";
        action === "everyone_ready" && sinon.assert.calledTwice(onMessageStub);
      });

    roomPlayer1 = await player1.join("SuperGame");
    roomPlayer2 = await player2.join("SuperGame");
    sinon.assert.calledTwice(onJoinStub);

    roomPlayer1.send({ action: "ready", pseudo: "player1" });
    roomPlayer2.send({ action: "ready", pseudo: "player2" });
  });
}); */
