import {distanceByLoc} from "./locationutils";
import History from "../socket-rooms/ColyseusSchema/history";
import Move from "../socket-rooms/ColyseusSchema/movehistory";
import Action from "../socket-rooms/ColyseusSchema/actionhistory";

export const getResultsSolo = (history: History, pointUnity: number) => {
  const moves = history.getHistoryMoves();
  const actions = history.getHistoryActions();

  const totalDistance = moves.reduce(
    (acc, move: Move) =>
    {
        return acc + distanceByLoc(move.getPrevLocation(), move.getNewLocation());
    },0
  );
  const totalCatches = actions
    .filter((action: Action) => {
      return action.getAction() === "catch" && action.getStatus() === "success";
    })
    .reduce((acc, cur) => acc + 1, 0);

  const timeSum = moves.reduce(
    (acc, move: Move) => acc + move.getTimestamp(),
    0
  );

  const avgSpeed = moves.reduce(
    (acc, move: Move) =>
      acc + (move.getSpeed() * move.getTimestamp()) / timeSum,
    0
  );
  const maxSpeed = Math.max(...moves.map((move: Move) => move.getSpeed()));

  const points = totalCatches * pointUnity;
  let totalTime = 0;
  if (moves.length <= 1) {
    totalTime = Math.abs(new Date().getTime() - moves[0].getTimestamp());
  } else {
    const lastElement = moves[moves.length - 1];
    totalTime = Math.abs(lastElement.getTimestamp() - moves[0].getTimestamp());
  }

  const catchesLocation = actions
    .filter((action: Action) => {
      return action.getAction() === "catch" && action.getStatus() === "success";
    })
    .map((action: Action, i) => {
      return {
        id: i,
        location: action.getChaseObjectLocation(),
        timestamp: action.getTimestamp()
      };
    });

  console.log(catchesLocation);

  const results = {
    totalDistance,
    totalCatches,
    totalTime,
    maxSpeed,
    avgSpeed,
    points,
    catchesLocation
  };
  console.log(results);

  return results;
};
