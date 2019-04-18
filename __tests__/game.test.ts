import {assert, expect} from "chai";
import Game from "../src/game";
import Player from "../src/player";
import {getResults} from "../src/results";

describe("Game Scenarios", () => {
  let game: Game;
  let i = 1;
  const loc = [5, 5];
  const polygon = [[0, 0], [0, 10], [10, 10], [10, 0]];
  beforeEach(() => {
    const options = {
      chaseObjectLoc: [1, 1],
      gameId: i,
      arealoc: loc,
      bounds: polygon
    };
    game = new Game(options);
    game.createPlayer("1", "player1", 0, 0);
    game.createPlayer("2", "player2", 0, 0);
    game.createPlayer("3", "player3", 0, 0);
    game.createPlayer("4", "player4", 0, 0);
    i++;
  });

  it("Scenario 1: Player 1 moves and catches the ChaseObject", async () => {
    game.movePlayer("1", {lat: 1, lon: 1});
    game.movePlayer("2", {lat: 0, lon: 1});
    game.movePlayer("3", {lat: 0, lon: 1});
    game.movePlayer("4", {lat: 0, lon: 0});

    const res2 = await game.catchChaseObject("2");
    const res3 = await game.catchChaseObject("3");
    const res4 = await game.catchChaseObject("4");
    const res1 = await game.catchChaseObject("1");
    assert.equal(res1, true);
    assert.equal(res2, false);
    assert.equal(res3, false);
    assert.equal(res4, false);
    assert.equal(game.getGuardian().pseudo, "player1");
  });

  it("Scenario 2: Player 1 moves and catches the ChaseObject, Player2 steals him", async () => {
    game.movePlayer("1", {lat: 1, lon: 1});
    game.movePlayer("2", {lat: 0, lon: 1});
    game.movePlayer("3", {lat: 0, lon: 1});
    game.movePlayer("4", {lat: 0, lon: 0});

    const res2 = await game.catchChaseObject("2");
    const res3 = await game.catchChaseObject("3");
    const res4 = await game.catchChaseObject("4");
    const res1 = await game.catchChaseObject("1");
    assert.equal(res1, true);
    assert.equal(res2, false);
    assert.equal(res3, false);
    assert.equal(res4, false);
    assert.equal(game.getGuardian().pseudo, "player1");

    game.movePlayer("2", {lat: 1, lon: 1});
    const resSteal = await game.stealChaseObject("2");
    assert.equal(resSteal, true);
    assert.equal(game.getGuardian().pseudo, "player2");
  });

  it("Scenario 3: Guardian Reset => Player 1 moves and catches the ChaseObject, Player2 steals him and exit the area, ChaseObject backs randomly in the map", async () => {
    const chaseobjectloc = game.getChaseObjectLocation();
    game.movePlayer("1", {lat: 1, lon: 1});
    game.movePlayer("2", {lat: 0, lon: 1});
    game.movePlayer("3", {lat: 0, lon: 1});
    game.movePlayer("4", {lat: 0, lon: 0});

    const res1 = await game.catchChaseObject("1");
    assert.equal(res1, true);
    game.movePlayer("2", {lat: 1, lon: 1});
    const resSteal = await game.stealChaseObject("2");
    assert.equal(resSteal, true);
    assert.equal(game.getGuardian().pseudo, "player2");
    game.movePlayer("2", {lat: 11, lon: 11});
    assert.notDeepEqual(chaseobjectloc, game.getChaseObjectLocation());
    assert.equal(game.getGuardian(), null);
  });

  it("Scenario 4: Announcing the winner and scoreboard", async () => {
    const chaseobjectloc = game.getChaseObjectLocation();
    game.movePlayer("1", {lat: 1, lon: 1});
    game.movePlayer("2", {lat: 0, lon: 1});
    game.movePlayer("3", {lat: 0, lon: 1});
    game.movePlayer("4", {lat: 0, lon: 0});

    const res1 = await game.catchChaseObject("1");
    assert.equal(res1, true);
    game.movePlayer("2", {lat: 1, lon: 1});
    const resSteal = await game.stealChaseObject("2");
    assert.equal(resSteal, true);
    assert.equal(game.getGuardian().pseudo, "player2");
    game.movePlayer("2", {lat: 1, lon: 1});
    game.movePlayer("2", {lat: 2, lon: 2});
    game.movePlayer("2", {lat: 3, lon: 3});
    game.movePlayer("1", {lat: 3, lon: 3});
    const resStealPlayer1 = await game.stealChaseObject("1");
    game.movePlayer("3", {lat: 3, lon: 3});
    game.movePlayer("1", {lat: 4, lon: 4});
    const resStealPlayer3 = await game.stealChaseObject("3");
    assert.equal(resStealPlayer3, false);
    game.movePlayer("4", {lat: 4, lon: 4});
    const resStealPlayer4 = await game.stealChaseObject("4");
    assert.equal(resStealPlayer4, true);
    assert.equal(game.getGuardian().getPseudo(), "player4");
    const {totalCatchs, totalSteals, totalSkillsUsed} = getResults(
      game.getHistory()
    );
    assert.equal(totalCatchs, 1);
    assert.equal(totalSteals, 3);
    assert.equal(totalSkillsUsed, 0);
  });
});
