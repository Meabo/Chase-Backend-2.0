import {Schema, type, ArraySchema} from "@colyseus/schema";
import {Location} from "../src/location";

export default class Area extends Schema {
  @type(Location)
  location: Location;

  @type([Location])
  bounds = new ArraySchema<Location>();

  @type("string")
  name: string;

  constructor(location: number[], bounds: number[][], name: string) {
    super();
    this.location = new Location(location[0], location[1]);
    bounds.map((bound) => this.bounds.push(new Location(bound[0], bound[1])));
    this.name = name;
  }

  getName() {
    return this.name;
  }

  getLocation() {
    return this.location;
  }

  getBounds() {
    return this.bounds;
  }
}
