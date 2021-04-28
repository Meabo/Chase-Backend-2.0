import {Schema, type, ArraySchema} from "@colyseus/schema";
import Action from "../ActionHistory";
import Move from "../MoveHistory";

export default class RoomHistory extends Schema {
  @type(["string"])
  events = new ArraySchema<string>();

  getHistory() {
    return {events: this.events};
  }
}
