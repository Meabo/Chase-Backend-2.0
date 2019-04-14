import {Room, Client} from "colyseus";
import {gameServer, methods} from "../socketServer";

export default class GameInstance extends Room {
  // When room is initialized
  onInit(options: any) {
    this.setState({
      name: options.name,
      history: [],
      players: [],
      gameInstance: [],
      ready: []
    });
  }

  // Checks if a new client is allowed to join. (default: `return true`)
  requestJoin(options: any, isNew: boolean) {
    return true;
  }
  // Authorize client based on provided options before WebSocket handshake is complete
  /*onAuth(options) */

  // When client successfully join the room
  onJoin(client: Client, options: any, auth) {
    console.log(`${client.sessionId} join GameInstance.`);
    this.setState({
      players: this.state.players.concat([
        {pseudo: "test", sessionId: client.sessionId}
      ])
    });
    this.state.history.push({
      action: "join",
      payload: `${client.sessionId} joined ${this.state.name}.`
    });
  }

  // When a client sends a message
  onMessage(client: Client, data: any) {}

  // When a client leaves the room
  onLeave(client: Client, consented: boolean) {
    this.state.history.push({
      action: "leave",
      payload: `${client.sessionId} left ${this.state.name}.`
    });
    this.setState({
      players: this.state.players.filter(
        (player) => player.sessionId !== client.sessionId
      )
    });
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {}
}
