import {Schema, type, ArraySchema} from "@colyseus/schema";
import Action from "./actionhistory";
import Move from "./movehistory";

export default class History extends Schema {
  @type([Action])
  actions = new ArraySchema<Action>();
  @type([Move])
  private moves = new ArraySchema<Move>();

  addMove(
    gameId: string,
    playerId: string,
    prevLocation: number[],
    newLocation: number[],
    timestamp: number,
    speed: number
  ) {
    const move = new Move(
      gameId,
      playerId,
      prevLocation,
      newLocation,
      timestamp,
      speed
    );
    this.moves.push(move);
  }

  addAction(gameId: string, playerId: string, action: string, payload: any) {
    this.actions.push(new Action(gameId, playerId, action, payload));
  }

  getHistoryMoves() {
    return this.moves;
  }

  getHistoryActions() {
    return this.actions;
  }

  getHistory() {
    return {actions: this.actions, moves: this.moves};
  }
}
