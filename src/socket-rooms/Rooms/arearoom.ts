import {Room, Client} from "colyseus";
import {eventBus} from "../../utils/emitter/emitter";
import {Schema, type, ArraySchema} from "@colyseus/schema";
import Area from "../ColyseusSchema/Area";
import History from "../ColyseusSchema/History";

class State extends Schema {
  @type([History])
  history = new ArraySchema<History>();

  @type(Area)
  area: Area;

  constructor(area: Area) {
    super();
    this.area = area;
  }
}

export default class AreaRoom extends Room<State> {
  // When room is initialized
  onCreate(options: any) {
    //let socketServerInstance = new SocketServer().getInstance();
    //console.log(this);
    this.setState(new State(options.area));
  }

  // Checks if a new client is allowed to join. (default: `return true`)
  requestJoin(options: any, isNew: boolean) {
    return true;
  }

  // Authorize client based on provided options before WebSocket handshake is complete
  //onAuth(options) {}

  // When client successfully join the room
  onJoin(client: Client, options: any, auth) {
    //console.log(`${client.sessionId} join Area.`);
    this.state.history.push(
      new History("join", client.sessionId, new Date().getTime())
    );
  }

  // When a client sends a message
  onMessage(client: Client, data: any) {
    const {action, roomName} = data;
    switch (action) {
      case "getArea":
        this.send(client, this.state.area);
        break;
      case "joingameroom":
        eventBus.sendEvent("createGameLobby", data);
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
