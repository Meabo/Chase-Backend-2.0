import {Schema, type, ArraySchema} from "@colyseus/schema";
import Action from "./actionhistory";
import Move from "./movehistory";

export default class RoomHistory extends Schema {
  @type(["string"])
  events = new ArraySchema<string>();

  getHistory() {
    return {events: this.events};
  }
}
