import { Schema, ArraySchema } from "@colyseus/schema";
import Action from "../src/actionhistory";
import Move from "../src/movehistory";
export default class History extends Schema {
    actions: ArraySchema<Action>;
    private moves;
    addMove(gameId: string, playerId: string, prevLocation: number[], newLocation: number[], timestamp: number): void;
    addAction(gameId: string, playerId: string, action: string, payload: any): void;
    getHistoryMoves(): ArraySchema<Move>;
    getHistoryActions(): ArraySchema<Action>;
    getHistory(): {
        actions: ArraySchema<Action>;
        moves: ArraySchema<Move>;
    };
}
