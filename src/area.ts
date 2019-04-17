import {Schema, type, ArraySchema} from "@colyseus/schema";
import {Location} from "../src/location";
import {robustPointInPolygon} from "./utils/locationutils";

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

  isInside(): boolean {
    const result = robustPointInPolygon(
      this.getBounds(),
      this.location.getLocation()
    );
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
    return [
      this.bounds[0].getLocation(),
      this.bounds[1].getLocation(),
      this.bounds[2].getLocation(),
      this.bounds[3].getLocation()
    ];
  }
}
