import {Room, Client} from "colyseus";
import GameSolo from "../gameSolo";
import { transcode } from "buffer";

export default class GameInstanceSolo extends Room<GameSolo> {
  // When room is initialized$
  gameSolo: GameSolo;
  options: any;
  maxClient = 1;
  gameStarted = false;

  onCreate(options: any) {
    this.options = options;
    if (!this.gameSolo) this.gameSolo = new GameSolo(this.options);
    this.setState(this.gameSolo);
  }
  // Checks if a new client is allowed to join. (default: `return true`)
  requestJoin(options: any, isNew: boolean) {
    return true;
  }
  // Authorize client based on provided options before WebSocket handshake is complete
  onAuth(options) {
    return true;
  }

  // When client successfully join the room
  async onJoin(client: Client, options: any, auth) {
    console.log(`${client.sessionId} join GameInstanceSolo.`);

    const res = new Promise((resolve, reject) => {
      const {pseudo, lat, lon} = options;
      this.state.createPlayer(client.sessionId, pseudo, lat, lon);
      resolve(true);
    });
    await res;
  }

  beginGame(time: number) {
    console.log("GameBegins");
    this.gameStarted = true;
    this.broadcast({message: "startGame"});
    this.broadcast({
      message: "chaseObject",
      value: {chaseObject: this.gameSolo.getChaseObjectLocation(), time: time, bounds: this.gameSolo.getCurrentBounds(), triangles: this.gameSolo.getAreaTriangles()}
    });
    console.log("ChaseObject Broadcasted", time);
    this.clock.setTimeout(() => this.finishedGame(), time * 1000);
  }

  finishedGame() {
    console.log("GameFinished");
    const results = this.state.getResult();
    this.broadcast({message: "results", value: results});
   // this.broadcast({message: "gameFinished"});
    this.disconnect();
  }
  // When a client sends a message
  onMessage(client: Client, data: any) {
    const {action, payload} = data;
    console.log("received action", action);
    switch (action) {
      case "start":
        console.log(payload);
        this.beginGame(payload);
        break;
      case "move":
        this.gameStarted && this.state.movePlayer(client.sessionId, payload);
        break;
      case "catch":
        this.state.catchChaseObject(client.sessionId);
        break;
    }
  }

  // When a client leaves the room
  onLeave(client: Client, consented: boolean) {
    console.log("Player left", client.sessionId);
    this.state.removePlayer(client.sessionId);
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {
    console.log("onDispose called");
    this.gameSolo = null;
  }
}
