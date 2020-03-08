import {Room, Client} from "colyseus";
import {Schema, type, ArraySchema} from "@colyseus/schema";
import {eventBus} from "../utils/emitter/emitter";
import History from "../history";
import Player from "../player";

class State extends Schema {
  @type("string")
  name: String;

  @type([History])
  history = new ArraySchema<History>();

  @type([Player])
  players = new ArraySchema<Player>();

  @type(["string"])
  ready = new ArraySchema<string>();

  constructor(options) {
    super();
    this.name = options.name;
  }
}

export default class GameLobby extends Room {
  // When room is initialized
  onCreate(options: any) {
    this.setState(new State(options));
  }

  // Checks if a new client is allowed to join. (default: `return true`)
  requestJoin(options: any, isNew: boolean) {
    return true;
  }

  everyoneIsReady(clients, playersReady): boolean {
    return clients.length === playersReady.length;
  }
  // Authorize client based on provided options before WebSocket handshake is complete
  /*onAuth(options) {
   */

  // When client successfully join the room
  onJoin(client: Client, options: any, auth) {
    console.log(`${client.sessionId} join GameLobby.`);
    //this.state.history.push(`${client.sessionId} joined GameLobby.`);
  }

  // When a client sends a message
  onMessage(client: Client, data: any) {
    if (data.action === "ready") {
      if (this.state.ready.includes(data.pseudo)) {
        this.state.ready = this.state.ready.filter(
          (pseudo) => pseudo !== data.pseudo
        );
      } else {
        this.state.ready.push(data.pseudo);
      }
      if (this.everyoneIsReady(this.clients, this.state.ready)) {
        eventBus.sendEvent("createGame", {name: this.state.name});
        this.broadcast({action: "everyone_ready"});
      }
    }
    if (data.action === "leave") {
      this.onLeave(client, true);
    }
  }
  // When a client leaves the room
  onLeave(client: Client, consented: boolean) {
    //this.state.history.push(`${client.sessionId} left GameLobby.`);
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {}
}
