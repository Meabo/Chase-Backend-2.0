import { Schema, ArraySchema } from "@colyseus/schema";
import { Location } from "../src/location";
export default class Area extends Schema {
    location: Location;
    bounds: ArraySchema<Location>;
    name: string;
    constructor(location: number[], bounds: number[][], name: string);
    isInside(loc: number[]): boolean;
    getName(): string;
    getLocation(): number[];
    getBounds(): number[][];
}
