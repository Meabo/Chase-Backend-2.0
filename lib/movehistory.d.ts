import { Schema } from "@colyseus/schema";
export default class Move extends Schema {
    private gameId;
    private playerId;
    private prevlocation;
    private newlocation;
    private timestamp;
    constructor(gameId: string, playerId: string, prevLocation: number[], newLocation: number[], timestamp: number);
    getPrevLocation(): number[];
    getNewLocation(): number[];
    getPlayerId(): string;
}
