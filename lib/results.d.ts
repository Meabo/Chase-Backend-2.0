import History from "./history";
import Player from "./player";
export declare function getResults(history: History): {
    totalDistance: number;
    totalCatchs: number;
    totalSteals: number;
    totalSkillsUsed: number;
};
export declare function getResultsByPlayer(history: History, player: Player): {
    totalDistanceByPlayer: number;
    totalCatchsByPlayer: number;
    totalStealsByPlayer: number;
    totalSkillsUsedByPlayer: number;
};
