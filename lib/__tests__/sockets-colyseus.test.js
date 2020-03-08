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
const port = 3000;
const socketUrl = `ws://localhost:${port}`;
const colyseus_js_1 = require("colyseus.js");
const area_1 = require("../area");
const socketServer_1 = require("../socketServer");
const chai_1 = require("chai");
describe("Colyseus : Unit it on Events", () => {
    const areas = [];
    const bounds = [
        [48.8569443, 2.2940138],
        [48.8586221, 2.2963717],
        [48.8523546, 2.3012814],
        [48.8539637, 2.3035665]
    ];
    const loc = [48.8556475, 2.2986304];
    before(() => __awaiter(this, void 0, void 0, function* () {
        const area = new area_1.default([48.8556475, 2.2986304], bounds, "AreaA");
        const area1 = new area_1.default([48.8556475, 2.2986304], bounds, "AreaB");
        areas.push(area, area1);
        yield socketServer_1.methods.init(areas);
        socketServer_1.gameServer.listen(port);
    }));
    after(() => __awaiter(this, void 0, void 0, function* () {
        console.log("shutdown");
        yield new Promise((resolve, reject) => {
            socketServer_1.gameServer.gracefullyShutdown();
            resolve();
        });
    }));
    describe("Basic Connection", () => {
        let client;
        beforeEach(() => {
            client = new colyseus_js_1.Client(socketUrl);
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
        let player1;
        beforeEach(() => {
            player1 = new colyseus_js_1.Client(socketUrl);
        });
        afterEach(() => {
            player1.close();
        });
        it("Players should receive Areas in Discovery mode", () => __awaiter(this, void 0, void 0, function* () {
            const listenerPlayer1 = player1.join("discovery");
            const joined = new Promise((resolve, reject) => {
                listenerPlayer1.onJoin.add(() => {
                    resolve();
                });
            });
            yield joined;
            const sendRequestToGetAreas = new Promise((resolve, reject) => {
                listenerPlayer1.send({ action: "getAreas" });
                resolve(true);
            });
            yield sendRequestToGetAreas;
            const getAreas = new Promise((resolve, reject) => {
                listenerPlayer1.onMessage.add((areas) => {
                    resolve(areas);
                });
            });
            const areas = yield getAreas;
        }));
    });
    describe("Enter an Area", () => {
        let player1;
        beforeEach(() => {
            player1 = new colyseus_js_1.Client("ws://localhost:3000");
        });
        afterEach(() => {
            player1.close();
        });
        it("Players should join a specific area", () => __awaiter(this, void 0, void 0, function* () {
            const specificArea = "AreaA";
            const joinSpecificArea = new Promise((resolve, reject) => {
                const listenerPlayer1 = player1.join(specificArea);
                listenerPlayer1.onJoin.add(() => {
                    listenerPlayer1.send({ action: "getArea" });
                    listenerPlayer1.onMessage.add((area) => {
                        resolve(area);
                    });
                });
            });
            yield joinSpecificArea;
        }));
    });
    describe("Game Engine", () => {
        let player1;
        let player2;
        const timeout = (ms) => new Promise((res) => setTimeout(res, ms));
        let i = 1;
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            socketServer_1.methods.createGame({
                name: "SuperGameBegins" + i,
                chaseObjectLoc: [1, 1],
                gameId: i + "",
                arealoc: loc,
                bounds
            });
            player1 = new colyseus_js_1.Client("ws://localhost:3000");
            player2 = new colyseus_js_1.Client("ws://localhost:3000");
            i++;
        }));
        afterEach(() => __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                player1.close();
                player2.close();
                resolve();
            });
        }));
        it("Should receive player's update ", () => __awaiter(this, void 0, void 0, function* () {
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
                        listenerPlayer.send({ action: "move", payload: { lat: 1, lon: 1 } });
                        resolve();
                    });
                });
            });
            yield joined;
            const received = new Promise((resolve, reject) => {
                listenerPlayer2.state.players.onChange = (player, i) => {
                    resolve();
                };
            });
            yield received;
        }));
        it("Should catch ChaseObject if a player is at the same location of the ChaseObject", () => __awaiter(this, void 0, void 0, function* () {
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
                        listenerPlayer.send({ action: "catch", payload: { lat: 1, lon: 1 } });
                        resolve();
                    });
                });
            });
            yield joined;
            const received = new Promise((resolve, reject) => {
                listenerPlayer2.state.onChange = (changes) => {
                    const { value } = changes.filter((change) => change.field === "guardian")[0];
                    resolve(value.pseudo);
                };
            });
            const pseudo = yield received;
            chai_1.assert.equal(pseudo, "guardian");
        }));
        it("Should steal ChaseObject if a player is at the same location of the guardian", () => __awaiter(this, void 0, void 0, function* () {
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
                    listenerPlayer2.send({ action: "steal", payload: { lat: 1, lon: 1 } });
                    resolve();
                });
            });
            yield joined;
            const received = new Promise((resolve, reject) => {
                listenerPlayer.state.onChange = (changes) => {
                    const { value } = changes.filter((change) => change.field === "guardian")[0];
                    resolve(value.pseudo);
                };
            });
            const pseudo = yield received;
            chai_1.assert.equal(pseudo, "stealer");
        }));
        it("Should end the game when the timer is finished", () => __awaiter(this, void 0, void 0, function* () {
            const listenerPlayer = player1.join("SuperGameBegins4", {
                pseudo: "guardian",
                lat: 1,
                lon: 1
            });
            const listenerPlayer2 = player2.join("SuperGameBegins4", {
                pseudo: "stealer",
                lat: 1,
                lon: 1
            });
            const joined = new Promise((resolve, reject) => {
                listenerPlayer2.onJoin.add(() => {
                    listenerPlayer2.send({ action: "catch", payload: { lat: 1, lon: 1 } });
                    resolve();
                });
            });
            yield joined;
            const received = new Promise((resolve, reject) => {
                listenerPlayer.state.onChange = (changes) => {
                    let change = changes.filter((change) => change.field === "gameFinished")[0];
                    if (change.value === true)
                        resolve(change.value);
                };
            });
            const finished = yield received;
            chai_1.assert.equal(finished, true);
        }));
        it("", () => __awaiter(this, void 0, void 0, function* () { }));
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
