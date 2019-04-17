import {Room, Client} from "colyseus";
import {gameServer, methods} from "../socketServer";
import {Schema, type, ArraySchema} from "@colyseus/schema";
import Area from "../area";
import History from "../history";

class State extends Schema {
  @type([History])
  history = new ArraySchema<History>();

  @type([Area])
  areas = new ArraySchema<Area>();

  constructor(areas: Area[]) {
    super();
    this.areas.push(...areas);
  }
}

export default class Discovery extends Room<State> {
  // When room is initialized
  onInit(options: any) {
    this.setState(new State(options.areas));
  }
  async onAuth(options: any) {
    return {success: true};
  }
  // Checks if a new client is allowed to join. (default: `return true`)
  requestJoin(options: any, isNew: boolean) {
    return true;
  }

  // Authorize client based on provided options before WebSocket handshake is complete
  //onAuth(options) {}

  // When client successfully join the room
  onJoin(client: Client, options: any, auth) {
    //console.log(`${client.sessionId} join Discovery.`);
    this.state.history.push(
      new History("join", client.sessionId, new Date().getTime())
    );
  }

  // When a client sends a message
  onMessage(client: Client, data: any) {
    const {action, roomName} = data;
    switch (action) {
      case "getAreas":
        this.send(client, this.state.areas);
        break;
      case "leaveDiscovery":
        this.onLeave(client, true);
        break;
    }
  }

  // When a client leaves the room
  async onLeave(client: Client, consented: boolean) {
    this.state.history.push(
      new History("leave", client.sessionId, new Date().getTime())
    );
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {}
}
