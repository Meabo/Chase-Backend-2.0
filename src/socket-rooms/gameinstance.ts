import {Room, Client} from "colyseus";
import Game from "../game";

export default class GameInstance extends Room<Game> {
  // When room is initialized
  onCreate(options: any) {
    this.setState(new Game(options));
  }
  // Checks if a new client is allowed to join. (default: `return true`)
  requestJoin(options: any, isNew: boolean) {
    return true;
  }
  // Authorize client based on provided options before WebSocket handshake is complete
  /*onAuth(options) */
  beginGame(time: number) {
    console.log("GameBegins");
    this.broadcast("gameBegins");
    this.clock.setTimeout(() => this.finishedGame(), time * 1000);
  }
  finishedGame() {
    console.log("GameFinished");
    this.broadcast("gameFinished");
    this.disconnect();
  }
  // When client successfully join the room
  onJoin(client: Client, options: any, auth) {
    //console.log(`${client.sessionId} join GameInstance.`);
    const {pseudo, lat, lon} = options;
    this.state.createPlayer(client.sessionId, pseudo, lat, lon);
  }

  // When a client sends a message
  async onMessage(client: Client, data: any) {
    const {action, payload} = data;
    switch (action) {
      case "move":
        this.state.movePlayer(client.sessionId, payload);
        break;
      case "catch":
        this.state.catchChaseObject(client.sessionId);
        break;
      case "steal":
        this.state.stealChaseObject(client.sessionId);
        break;
    }
  }

  // When a client leaves the room
  onLeave(client: Client, consented: boolean) {
    this.state.removePlayer(client.sessionId);
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {}
}
