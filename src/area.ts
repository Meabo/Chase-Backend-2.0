import {Schema, type, ArraySchema} from "@colyseus/schema";
import {Location} from "../src/location";
import {robustPointInPolygon, triangulate} from "./utils/locationutils";

export default class Area {
  location:  number[];

  bounds: number[][]

  name: string;

  constructor(name: string, location: number[], bounds: number[][]) {
    this.location = location;
    this.bounds = bounds;
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
    return this.location
  }

  getBounds() {
    return this.bounds;
  }

  getTriangles() {
    return triangulate(this.getBounds());
  }
}
