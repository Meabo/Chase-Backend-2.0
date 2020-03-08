import { Schema, type } from "@colyseus/schema";

export default class ChaseObject extends Schema {
  @type("float32")
  lat: number;

  @type("float32")
  lon: number;

  constructor(lat: number, lon: number) {
    super();
    this.lat = lat;
    this.lon = lon;
  }

  getLocation() {
    return [this.lat, this.lon];
  }
}
