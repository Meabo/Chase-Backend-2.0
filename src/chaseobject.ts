import {Schema, type} from "@colyseus/schema";

export default class ChaseObject extends Schema {
  @type("number")
  lat: number;

  @type("number")
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