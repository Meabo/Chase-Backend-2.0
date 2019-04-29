const port: number = 5000;
const socketUrl: string = `ws://localhost:${port}`;
import {Client} from "colyseus.js";
import Area from "../src/area";
import {methods, gameServer} from "../servers/socketServer";
import {assert, expect} from "chai";

describe("Colyseus : Unit it on Events", () => {
  const areas: Area[] = [];
  const bounds: number[][] = [
    [48.8569443, 2.2940138],
    [48.8586221, 2.2963717],
    [48.8523546, 2.3012814],
    [48.8539637, 2.3035665]
  ];
  const loc = [48.8556475, 2.2986304];

  before(async () => {
    const area = new Area([48.8556475, 2.2986304], bounds, "AreaA");
    const area1 = new Area([48.8556475, 2.2986304], bounds, "AreaB");
    areas.push(area, area1);
    await methods.init(areas);
    gameServer.listen(port);
  });

  after(async () => {
    console.log("shutdown");
    await new Promise((resolve, reject) => {
      gameServer.gracefullyShutdown();
      resolve();
    });
  });

  describe("Basic Connection", () => {
    let client: Client;

    beforeEach(() => {
      client = new Client(socketUrl);
    });
    afterEach(() => {
      client.close();
    });
    it("Should check that the socket is connected", (done) => {
      client.onOpen.add(() => {
        done();
      });
      client.onError.add((err) => {
        console.log("something wrong happened:", err.message);
      });
    });
  });

  describe("Welcome to Discovery", () => {
    let player1: Client;

    beforeEach(() => {
      player1 = new Client(socketUrl);
    });

    afterEach(() => {
      player1.close();
    });

    it("Players should receive Areas in Discovery mode", async () => {
      const listenerPlayer1 = player1.join("discovery");
      const joined = new Promise((resolve, reject) => {
        listenerPlayer1.onJoin.add(() => {
          resolve();
        });
      });
      await joined;
      const sendRequestToGetAreas = new Promise((resolve, reject) => {
        listenerPlayer1.send({action: "getAreas"});
        resolve(true);
      });
      await sendRequestToGetAreas;
      const getAreas = new Promise((resolve, reject) => {
        listenerPlayer1.onMessage.add((areas) => {
          resolve(areas);
        });
      });
      const areas = await getAreas;
    });
  });

  describe("Enter an Area", () => {
    let player1;

    beforeEach(() => {
      player1 = new Client(`ws://localhost:${port}`);
    });

    afterEach(() => {
      player1.close();
    });

    it("Players should join a specific area", async () => {
      const specificArea = "AreaA";
      const joinSpecificArea = new Promise((resolve, reject) => {
        const listenerPlayer1 = player1.join(specificArea);
        listenerPlayer1.onJoin.add(() => {
          listenerPlayer1.send({action: "getArea"});
          listenerPlayer1.onMessage.add((area) => {
            resolve(area);
          });
        });
      });
      await joinSpecificArea;
    });
  });

  describe("Game Engine", () => {
    let player1;
    let player2;
    const timeout = (ms) => new Promise((res) => setTimeout(res, ms));
    let i = 1;

    beforeEach(async () => {
      methods.createGame({
        name: "SuperGameBegins" + i,
        chaseObjectLoc: [1, 1],
        gameId: i + "",
        arealoc: loc,
        bounds
      });
      player1 = new Client(`ws://localhost:${port}`);
      player2 = new Client(`ws://localhost:${port}`);
      i++;
    });

    afterEach(async () => {
      return await new Promise((resolve, reject) => {
        player1.close();
        player2.close();
        resolve();
      });
    });

    it("Should receive player's update ", async () => {
      const listenerPlayer = player1.join("SuperGameBegins1", {
        pseudo: "player1",
        lat: 0,
        lon: 0
      });
      const listenerPlayer2 = player2.join("SuperGameBegins1", {
        pseudo: "player2",
        lat: 0,
        lon: 0
      });
      const joined = new Promise((resolve, reject) => {
        listenerPlayer.onJoin.add(() => {
          listenerPlayer2.onJoin.add(() => {
            listenerPlayer.send({action: "move", payload: {lat: 1, lon: 1}});
            resolve();
          });
        });
      });
      await joined;
      const received = new Promise((resolve, reject) => {
        listenerPlayer2.state.players.onChange = (player, i) => {
          resolve();
        };
      });
      await received;
    });

    it("Should catch ChaseObject if a player is at the same location of the ChaseObject", async () => {
      const listenerPlayer = player1.join("SuperGameBegins2", {
        pseudo: "guardian",
        lat: 1,
        lon: 1
      });
      const listenerPlayer2 = player2.join("SuperGameBegins2", {
        pseudo: "chaser",
        lat: 0,
        lon: 0
      });
      const joined = new Promise((resolve, reject) => {
        listenerPlayer.onJoin.add(() => {
          listenerPlayer2.onJoin.add(() => {
            listenerPlayer.send({action: "catch"});
            resolve();
          });
        });
      });
      await joined;
      const received = new Promise((resolve, reject) => {
        listenerPlayer2.state.onChange = (changes) => {
          const {value} = changes.filter(
            (change) => change.field === "guardian"
          )[0];
          if (value.pseudo) resolve(value.pseudo);
        };
      });
      const pseudo = await received;
      assert.equal(pseudo, "guardian");
    });

    it("Should steal ChaseObject if a player is at the same location of the guardian", async () => {
      const listenerPlayer = player1.join("SuperGameBegins2", {
        pseudo: "guardian",
        lat: 1,
        lon: 1
      });
      const listenerPlayer2 = player2.join("SuperGameBegins2", {
        pseudo: "stealer",
        lat: 1,
        lon: 1
      });
      const joined = new Promise((resolve, reject) => {
        listenerPlayer2.onJoin.add(() => {
          listenerPlayer2.send({action: "steal"});
          resolve();
        });
      });
      await joined;
      const received = new Promise((resolve, reject) => {
        listenerPlayer.state.onChange = (changes) => {
          const {value} = changes.filter(
            (change) => change.field === "guardian"
          )[0];
          if (value.pseudo) resolve(value.pseudo);
        };
      });
      const pseudo = await received;
      assert.equal(pseudo, "stealer");
    });
  });
});
/*
  describe('Enter a Game Room', () => {
    let player1;
    let player2;

    before(async () => {
      player1 = new Client('ws://localhost:3000');
      player2 = new Client('ws://localhost:3000');
    });

    after(async () => {
      player1.close();
      player2.close();
    });

    it('Create a game room', async () => {
      let dataReceived;
      const listenerPlayer1 = player1.join(areas[0].name);

      listenerPlayer1.onJoin.add(() => {});
      listenerPlayer1.onStateChange.add((state) => {});
      const getAreas = new Promise((resolve, reject) => {
        listenerPlayer1.listen('area', (change) => {
          assert.deepEqual(areas[0], change.value);
          dataReceived = change.value;
          resolve(dataReceived);
          //;
        });
      });
      await getAreas;
      listenerPlayer1.send({
        action: 'joingameroom',
        name: 'SuperGame',
        create: true,
      });
      const listenerPlayer2 = player1.join('SuperGame');
      const PromiseToResolve = new Promise((resolve, reject) => {
        listenerPlayer2.onJoin.add(() => {
          console.log('Player1 joined GameRoom');
          listenerPlayer2.leave();
          resolve();
        });
      });

      await PromiseToResolve;
    });
  });
  describe('Ready feature', () => {
    let player1;
    let player2;

    before(async () => {
      methods.createGameLobby({ name: 'SuperGame' });
      player1 = new Client('ws://localhost:3000');
      player2 = new Client('ws://localhost:3000');
    });

    after(async () => {
      player1.close();
      player2.close();
    });

    it('Players ready in GameRoom', async () => {
      const listenerPlayer = player1.join('SuperGame');
      const listenerPlayer2 = player2.join('SuperGame');

      listenerPlayer.onJoin.add(() => {
        listenerPlayer.send({ action: 'ready', pseudo: 'player1' });
      });

      const getReadyPlayer1 = new Promise((resolve, reject) => {
        listenerPlayer.onMessage.add((message) => {
          if (message.action === 'everyone_ready') resolve();
        });
      });

      listenerPlayer2.onJoin.add(() => {
        listenerPlayer2.send({ action: 'ready', pseudo: 'player2' });
      });
      const getReadyPlayer2 = new Promise((resolve, reject) => {
        listenerPlayer2.onMessage.add((message) => {
          if (message.action === 'everyone_ready') resolve();
        });
      });

      await getReadyPlayer1;
      await getReadyPlayer2;
    });
  });*/
