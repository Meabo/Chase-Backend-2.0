import {Schema, type} from "@colyseus/schema";

export class Location extends Schema {
  @type("float64") lat: number;
  @type("float64") lon: number;

  getLocation() {
    return [this.lat, this.lon];
  }
}
