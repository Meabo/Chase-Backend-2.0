import {Schema, type, ArraySchema} from "@colyseus/schema";
import Action from "./ActionHistory";
import Move from "./MoveHistory";
import {Location} from "./location"

export default class History extends Schema {
  @type([Action])
  private actions = new ArraySchema<Action>();
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
    this.moves.push(new Move().assign({
      gameId,
      playerId,
      prevLocation: new Location().assign({lat: prevLocation[0], lon: prevLocation[1]}),
      newLocation:  new Location().assign({lat: newLocation[0], lon: newLocation[1]}),
      timestamp,
      speed
    }));
  }

  addAction(gameId: string, playerId: string, action: string, payload: any) {
    this.actions.push(new Action().assign({gameId, playerId, 
        status: payload.status,
        pseudo: payload.pseudo, 
        action, 
        location: new Location().assign({lat: payload.location[0], lon: payload.location[1]}),
        timestamp: payload.timestamp,
        chaseObjectLocation: payload.chaseObjectLocation,
        pseudoStealed: payload.pseudoStealed}));
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
