import { Schema } from "@colyseus/schema";
export default class Player extends Schema {
    pseudo: string;
    lat: number;
    lon: number;
    playerId: string;
    constructor(pseudo_: string, lat: number, lon: number);
    getPseudo(): string;
    getLocation(): number[];
    getPlayerId(): string;
}
