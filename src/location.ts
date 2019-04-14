import {Schema, type} from "@colyseus/schema";

export class Location extends Schema {
  @type("float32") lat: number;
  @type("float32") lon: number;

  constructor(lat: number, lon: number) {
    super();
    this.lat = lat;
    this.lon = lon;
  }
}
