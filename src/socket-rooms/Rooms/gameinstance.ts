import { Room, Client } from "colyseus";
import Game from "../GameLogic/game";

export default class GameInstance extends Room<Game> {
  // When room is initialized
  onCreate(options: any) {
    this.setState(new Game({ ...options }));
    const time = 30;
    const delay = 1 * 1000;
    this.onMessage("move", (client, position) => {
      this.state.movePlayer(client.sessionId, position);
    });
    this.onMessage("catch", (client, RFCMessage) => {
      this.state.catchChaseObject(client.sessionId);
    });
    this.onMessage("steal", (client, RFCMessage) => {
      this.state.stealChaseObject(client.sessionId);
    });
    //setTimeout(() => this.beginGame(time), delay);
  }
  // Checks if a new client is allowed to join. (default: `return true`)
  requestJoin(options: any, isNew: boolean) {
    return true;
  }
  // Authorize client based on provided options before WebSocket handshake is complete
  /*onAuth(options) */
  beginGame(time: number) {
    console.log("gameBegins");
    this.broadcast("gameBegins");
    //this.clock.setTimeout(() => this.finishedGame(), time * 1000);
  }

  finishedGame() {
    console.log("gameFinished");
    this.broadcast("gameFinished");
    //this.disconnect();
  }
  // When client successfully join the room
  onJoin(client: Client, options: any, auth) {
    //console.log(`${client.sessionId} join GameInstance.`);
    if (
      !options ||
      options.pseudo == null ||
      options.lat == null ||
      options.lon == null
    )
      throw new Error("Player doesn't have a pseudo, or a position");

    const { pseudo, lat, lon } = options;
    this.state.createPlayer(client.sessionId, pseudo, lat, lon);
    this.send(client, "gameBegins", null);
  }

  // When a client sends a message
  /*async onMessage(client: Client, data: any) {}*/

  // When a client leaves the room
  onLeave(client: Client, consented: boolean) {
    this.state.removePlayer(client.sessionId);
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {}
}
