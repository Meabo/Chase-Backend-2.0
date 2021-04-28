import {distanceByLoc} from "./locationutils";
import History from "../socket-rooms/ColyseusSchema/History";
import Move from "../socket-rooms/ColyseusSchema/MoveHistory";
import Action from "../socket-rooms/ColyseusSchema/ActionHistory";
import Player from "../socket-rooms/ColyseusSchema/PlayerGame";
import { Constants } from "./constants";

export function getResults(history: History) {
  const totalDistance = history
    .getHistoryMoves()
    .reduce(
      (acc, move: Move) =>
        acc + distanceByLoc(move.getPrevLocation(), move.getNewLocation()),
      0
    );
  const totalCatchs = history
    .getHistoryActions()
    .filter((action: Action) => {
      return action.getAction() === Constants.Actions.Catch && action.getStatus() === Constants.Success;
    })
    .reduce((acc, cur) => acc + 1, 0);

  const totalSteals = history
    .getHistoryActions()
    .filter(
      (action: Action) =>
        action.getAction() === Constants.Actions.Steal && action.getStatus() === Constants.Success
    )
    .reduce((acc, cur) => acc + 1, 0);

  const totalSkillsUsed = history
    .getHistoryActions()
    .filter(
      (action: Action) =>
        action.getAction() === Constants.Actions.Skill && action.getStatus() === Constants.Success
    )
    .reduce((acc, cur) => acc + 1, 0);

  return {
    totalDistance,
    totalCatchs,
    totalSteals,
    totalSkillsUsed
  };
}

export function getResultsByPlayer(history: History, player: Player) {
  const totalDistanceByPlayer = history
    .getHistoryMoves()
    .filter((move: Move) => move.getPlayerId() === player.getPlayerId())
    .reduce(
      (acc, move: Move) =>
        acc + distanceByLoc(move.getPrevLocation(), move.getNewLocation()),
      0
    );

  const totalCatchsByPlayer = history
    .getHistoryActions()
    .filter(
      (action: Action) =>
        action.getPseudo() === player.getPseudo() &&
        action.getAction() ===  Constants.Actions.Catch &&
        action.getStatus() === Constants.Success
    )
    .reduce((acc) => acc + 1, 0);

  const totalStealsByPlayer = history
    .getHistoryActions()
    .filter(
      (action: Action) =>
        action.getPseudo() === player.getPseudo() &&
        action.getAction() ===  Constants.Actions.Steal &&
        action.getStatus() ===  Constants.Success
    )
    .reduce((acc) => acc + 1, 0);

  const totalSkillsUsedByPlayer = history
    .getHistoryActions()
    .filter(
      (action: Action) =>
        action.getPseudo() === player.getPseudo() &&
        action.getAction() ===  Constants.Actions.Skill &&
        action.getStatus() === Constants.Success
    )
    .reduce((acc) => acc + 1, 0);

  return {
    totalDistanceByPlayer,
    totalCatchsByPlayer,
    totalStealsByPlayer,
    totalSkillsUsedByPlayer
  };
}
