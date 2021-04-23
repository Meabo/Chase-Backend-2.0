import { Schema, type } from "@colyseus/schema";
import shortid from "shortid";

export class Message extends Schema {
  @type("string")
  id: string = shortid.generate();

  @type("string")
  text: string;

  @type("string")
  sender: string;

  @type("int64")
  time: number = Date.now();
}
