const port: number = 5000;
const socketUrl: string = `ws://localhost:${port}`;
import {Client, Room} from "colyseus.js";
import Area from "../src/area";
import {methods, gameServer} from "../servers/socketServer";
import {assert, expect} from "chai";

const areas: Area[] = [];
const bounds: number[][] = [
  [48.8569443, 2.2940138],
  [48.8586221, 2.2963717],
  [48.8523546, 2.3012814],
  [48.8539637, 2.3035665]
];
const loc = [48.8556475, 2.2986304];

describe("Colyseus : Unit it on Events", () => {
  before(async () => {
    const area = new Area([48.8556475, 2.2986304], bounds, "AreaA");
    const area1 = new Area([48.8556475, 2.2986304], bounds, "AreaB");
    areas.push(area, area1);
    await methods.init(areas);
    gameServer.listen(port);
  });

  after(async () => {
    await new Promise((resolve, reject) => {
      gameServer.gracefullyShutdown();
      resolve();
    });
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
      client.joinOrCreate("discovery").then(room => {
        room_client = room;
        done();
      }).catch(err => console.log("something wrong happened:", err.message))

    });
  });
});

  describe("Welcome to Discovery", () => {
    let player1: Client;
    let room_player1: Room;
    beforeEach(() => {
      player1 = new Client(socketUrl);
    });

    afterEach(() => {
      room_player1.leave();
    });

    it("Players should receive Areas in Discovery mode", async () => {
     room_player1 = await player1.joinOrCreate("discovery");
     room_player1.send({action: "getAreas"});
     room_player1.onMessage((areas_discovery) => {
      assert.lengthOf(areas_discovery, 2) 
    });
    });
  });

  describe("Game Engine", () => {
    let player1: Client;
    let player2: Client;
    let room_player1: Room;
    let room_player2: Room;
    const room_name = "SuperGameBegins";

    before(() => {
      methods.createGame({name: room_name})
    })

    beforeEach(() => {
      player1 = new Client(socketUrl);
      player2 = new Client(socketUrl);
    });

    afterEach(async () => {
      return await new Promise((resolve, reject) => {
        room_player1.leave();
        room_player2.leave();
        resolve();
      });
    });

  it("Should receive player's update ", async () => {
    try {
      room_player1 = await player1.joinOrCreate(room_name,  {
        chaseObjectLoc: [1, 1],
        arealoc: loc,
        bounds,
        gameId: "1",
        pseudo: "player1",
        lat: 0,
        lon: 0
      });
      room_player2 = await player2.join(room_name,  {
        pseudo: "player2",
        lat: 0,
        lon: 0
      });
      const expected_location = {lat: 1, lon: 1}
      room_player1.send({action: "move", payload: expected_location})
      await new Promise(resolve => setTimeout(resolve, 100));

      const player1_state: any = Object.values(room_player2.state.players)[0];
      assert.equal(player1_state.lat, expected_location.lat)
      assert.equal(player1_state.lon, expected_location.lon)
    }
    catch (err) {
      console.log('Error', err)
    }
  })

  it("Should catch ChaseObject if a player is at the same location of the ChaseObject",  async() => {
    /*try {
      room_player1 = await player1.joinOrCreate(room_name,  {
      chaseObjectLoc: [1, 1],
      arealoc: loc,
      bounds,
      gameId: "10",
      pseudo: "guardian",
      lat: 1,
      lon: 1
    });
    room_player2 = await player2.join(room_name,  {
      pseudo: "player2",
      lat: 0,
      lon: 0
    });
    
    room_player1.send({action: "catch"});
    await new Promise(resolve => setTimeout(resolve, 100));
    const guardian: string = room_player2.state.guardian.pseudo;
    assert.equal("guardian", guardian) }
    catch (err) {
      console.log('Catch error', err);
    }*/
  });
  
  
  it("Should steal ChaseObject if a player is at the same location of the guardian", async () => {
   /* try {
      room_player1 = await player1.joinOrCreate(room_name,  {
        chaseObjectLoc: [1, 1],
        arealoc: loc,
        bounds,
        gameId: "100",
        pseudo: "guardian",
        lat: 1,
        lon: 1
      });
      
      room_player2 = await player2.join(room_name, {
          pseudo: "stealer",
          lat: 1,
          lon: 1
      });
      room_player1.send({action: "catch"});
      room_player2.send({action: "steal"});
      await new Promise(resolve => setTimeout(resolve, 50));
      assert.equal(room_player2.state.guardian.pseudo, "stealer");
    } catch (err) {
      console.log(err)
    } */
    });
  });
  describe('Ready feature', () => {
    let player1: Client;
    let player2: Client;
    let room_player1: Room;
    let room_player2: Room;

    before(async () => {
      methods.createGameLobby({ name: 'SuperGame' });
      player1 = new Client(socketUrl);
      player2 = new Client(socketUrl);
    });

    after(async () => {
      room_player1.leave();
      room_player2.leave();
    });

    it('Players ready in GameRoom', async () => {
      room_player1 = await player1.joinOrCreate('SuperGame');
      room_player2 = await player2.join('SuperGame');

     
      const player1_ready = new Promise((resolve, reject) => {
        room_player1.onMessage((message) => {
          if (message.action === 'everyone_ready') 
          resolve(true);
        });
      });
      const player2_ready = new Promise((resolve, reject) => {
        room_player2.onMessage((message) => {
          if (message.action === 'everyone_ready') 
          resolve(true);
        });
      });
      Promise.all([player1_ready, player2_ready]).then((values) => {
          assert.deepEqual(values, [true, true]);
      })
      
      room_player1.send({ action: 'ready', pseudo: 'player1' });
      room_player2.send({ action: 'ready', pseudo: 'player2' });
    });
  });