import {Room, Client} from "colyseus";
import {Schema, type, ArraySchema, MapSchema} from "@colyseus/schema";
import History from "../history";
import Player from "../player";

class State extends Schema {
  @type([History])
  history = new ArraySchema<History>();

  @type({map: Player})
  players = new MapSchema<Player>();

  createPlayer(id: string, pseudo: string, lat: number, lon: number) {
    this.players[id] = new Player(pseudo, lat, lon);
  }

  removePlayer(id: string) {
    delete this.players[id];
  }

  movePlayer(id: string, lat: number, lon: number) {
    /*this.players[id].lat = lat;
    this.players[id].lon = lon;*/
  }
}
export default class GameInstance extends Room<State> {
  // When room is initialized
  onInit(options: any) {
    this.setState(new State());
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
    const {pseudo, lat, lon} = options;
    this.state.createPlayer(client.sessionId, pseudo, lat, lon);
  }

  // When a client sends a message
  onMessage(client: Client, data: any) {
    const {action, payload} = data;
    switch (action) {
      case "move":
        const {lat, lon} = payload;
        this.state.movePlayer(client.sessionId, lat, lon);
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
