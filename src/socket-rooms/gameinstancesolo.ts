import {Room, Client, Clock} from "colyseus";
import GameSolo from "../gameSolo";
import {gameServer} from "../../servers/socketServer";

export default class GameInstanceSolo extends Room<GameSolo> {
  // When room is initialized$
  gameSolo: GameSolo;

  onInit(options: any) {
    this.gameSolo = new GameSolo(options);
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
  onJoin(client: Client, options: any, auth) {
    console.log(`${client.sessionId} join GameInstanceSolo.`);
    const {pseudo, lat, lon} = options;
    this.state.createPlayer(client.sessionId, pseudo, lat, lon);
  }
  beginGame(time: number) {
    console.log("GameBegins");
    this.broadcast({
      message: "chaseObject",
      value: this.gameSolo.getChaseObjectLocation()
    });
    this.clock.setTimeout(() => this.finishedGame(), time * 1000);
  }
  finishedGame() {
    console.log("GameFinished");
    this.broadcast({message: "gameFinished"});
    this.disconnect();
  }
  // When a client sends a message
  async onMessage(client: Client, data: any) {
    const {action, payload} = data;
    console.log("received action");
    switch (action) {
      case "start":
        console.log(payload);
        const {time} = payload;
        this.beginGame(time);
        break;
      case "move":
        this.state.movePlayer(client.sessionId, payload);
        break;
      case "catch":
        await this.state.catchChaseObject(client.sessionId);
        break;
    }
  }

  // When a client leaves the room
  onLeave(client: Client, consented: boolean) {
    this.state.removePlayer(client.sessionId);
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {
    console.log("onDispose called");
  }
}
