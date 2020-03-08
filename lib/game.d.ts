import { Schema, MapSchema } from "@colyseus/schema";
import History from "./history";
import Player from "./player";
import ChaseObject from "./chaseobject";
export default class Game extends Schema {
    private history;
    players: MapSchema<Player>;
    private gameFinished;
    chaseObject: ChaseObject;
    private guardian;
    private area;
    private timer;
    private alreadyGuardian;
    private gameId;
    constructor(options: any);
    BeginTimer(limit: number, ticker: number): Promise<void>;
    createPlayer(id: string, pseudo: string, lat: number, lon: number): void;
    catchChaseObject(id: string): Promise<boolean>;
    stealChaseObject(id: string): boolean;
    removePlayer(id: string): void;
    generateAnotherPositionForChaseObject(): void;
    movePlayer(id: string, payload: any): void;
    getGuardian(): Player;
    getHistory(): History;
    getChaseObjectLocation(): number[];
}
