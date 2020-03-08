import {Schema, type, ArraySchema} from "@colyseus/schema";
import {Location} from "../src/location";
import {robustPointInPolygon, triangulate} from "./utils/locationutils";

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

  isInside(loc: number[]): boolean {
    const result = robustPointInPolygon(this.getBounds(), loc);
    if (result === -1 || result === 0) return true;
    return false;
  }

  getName() {
    return this.name;
  }

  getLocation() {
    return this.location.getLocation();
  }

  getBounds() {
    return this.bounds.map(bound => bound.getLocation());
  }

  getTriangles() {
      return triangulate(this.getBounds());
  }
}
