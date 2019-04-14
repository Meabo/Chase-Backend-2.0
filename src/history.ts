import {Schema, type, ArraySchema} from "@colyseus/schema";

export default class History extends Schema {
  @type("string")
  action: string = "";

  @type("string")
  sessionId: string = "";

  @type("number")
  timestamp: number;
}
