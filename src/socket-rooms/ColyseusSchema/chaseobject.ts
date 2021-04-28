import { Schema, type } from "@colyseus/schema";

export default class ChaseObject extends Schema {
  @type("float32")
  lat: number;

  @type("float32")
  lon: number;

  getLocation() {
    return [this.lat, this.lon];
  }
}
