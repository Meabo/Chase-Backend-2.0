import { Schema, type } from "@colyseus/schema";

export class UserLocation extends Schema {
  @type("float32")
  lat: number;

  @type("float32")
  lon: number;

  @type("float32")
  speed: number;
}