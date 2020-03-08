import { Schema } from "@colyseus/schema";
export default class Action extends Schema {
    private gameId;
    private playerId;
    private status;
    private pseudo;
    private action;
    private timestamp;
    private location;
    private pseudoStealed?;
    constructor(gameId: string, playerId: string, action: string, payload: any);
    getAction(): string;
    getStatus(): string;
    getPseudo(): string;
}
