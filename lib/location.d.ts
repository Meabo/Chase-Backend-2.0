import { Schema } from "@colyseus/schema";
export declare class Location extends Schema {
    lat: number;
    lon: number;
    constructor(lat: number, lon: number);
    getLocation(): number[];
}
