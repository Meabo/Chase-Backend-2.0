import {Schema, type, ArraySchema} from "@colyseus/schema";
import {Location} from "./Location";
import {robustPointInPolygon, triangulate} from "../../utils/locationutils";
import SchemaConverter from "../../utils/colyseusUtils"

export default class Area extends Schema {
  @type(Location)
  location: Location = new Location();

  @type([Location])
  bounds = new ArraySchema<Location>();

  @type("string")
  name: string;

  boundsArray: number[][]

  initBoundsArray() {
    this.boundsArray = SchemaConverter.LocationToDoubleArray(this.getBounds())
    console.log('this.boundArray', this.boundsArray)
  }

  isInside(loc: number[]): boolean {
    const result = robustPointInPolygon(this.boundsArray, loc);
    if (result === -1 || result === 0) return true;
    return false;
  }

  getName() {
    return this.name;
  }

  getLocation() {
    return this.location
  }

  getBounds() {
    return this.bounds;
  }

  getTriangles() {
    return triangulate(this.boundsArray);
  }
}
