"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locationutils_1 = require("./utils/locationutils");
function getResults(history) {
    const totalDistance = history
        .getHistoryMoves()
        .reduce((acc, move) => acc + locationutils_1.distanceByLoc(move.getPrevLocation(), move.getNewLocation()), 0);
    const totalCatchs = history
        .getHistoryActions()
        .filter((action) => {
        return action.getAction() === "catch" && action.getStatus() === "success";
    })
        .reduce((acc, cur) => acc + 1, 0);
    const totalSteals = history
        .getHistoryActions()
        .filter((action) => action.getAction() === "steal" && action.getStatus() === "success")
        .reduce((acc, cur) => acc + 1, 0);
    const totalSkillsUsed = history
        .getHistoryActions()
        .filter((action) => action.getAction() === "skill" && action.getStatus() === "success")
        .reduce((acc, cur) => acc + 1, 0);
    return {
        totalDistance,
        totalCatchs,
        totalSteals,
        totalSkillsUsed
    };
}
exports.getResults = getResults;
function getResultsByPlayer(history, player) {
    const totalDistanceByPlayer = history
        .getHistoryMoves()
        .filter((move) => move.getPlayerId() === player.getPlayerId())
        .reduce((acc, move) => acc + locationutils_1.distanceByLoc(move.getPrevLocation(), move.getNewLocation()), 0);
    const totalCatchsByPlayer = history
        .getHistoryActions()
        .filter((action) => action.getPseudo() === player.getPseudo() &&
        action.getAction() === "catch" &&
        action.getStatus() === "success")
        .reduce((acc) => acc + 1, 0);
    const totalStealsByPlayer = history
        .getHistoryActions()
        .filter((action) => action.getPseudo() === player.getPseudo() &&
        action.getAction() === "steal" &&
        action.getStatus() === "success")
        .reduce((acc) => acc + 1, 0);
    const totalSkillsUsedByPlayer = history
        .getHistoryActions()
        .filter((action) => action.getPseudo() === player.getPseudo() &&
        action.getAction() === "steal" &&
        action.getStatus() === "success")
        .reduce((acc) => acc + 1, 0);
    return {
        totalDistanceByPlayer,
        totalCatchsByPlayer,
        totalStealsByPlayer,
        totalSkillsUsedByPlayer
    };
}
exports.getResultsByPlayer = getResultsByPlayer;
