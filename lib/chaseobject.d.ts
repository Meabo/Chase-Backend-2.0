import { Schema } from "@colyseus/schema";
export default class ChaseObject extends Schema {
    lat: number;
    lon: number;
    constructor(lat: number, lon: number);
    getLocation(): number[];
}
