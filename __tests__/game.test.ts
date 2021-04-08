import Area from "../src/area";
import ChaseObject from "../src/chaseobject";
import Game from "../src/game";
import { getResults } from "../src/results";

describe("Game Scenarios", () => {
  let game: Game;
  let i = 1;
  const loc = [5, 5];
  const polygon = [
    [0, 0],
    [0, 10],
    [10, 10],
    [10, 0],
  ];
  beforeEach(() => {
    const options = {
      chaseObjectLoc: [1, 1],
      gameId: i,
      arealoc: loc,
      bounds: polygon,
      test: true,
    };
    game = new Game(options);
    game.setChaseObject(new ChaseObject(5, 5));
    game.setArea(new Area("Test", loc, polygon));
    game.createPlayer("1", "player1", 1, 1);
    game.createPlayer("2", "player2", 1, 1);
    game.createPlayer("3", "player3", 1, 1);
    game.createPlayer("4", "player4", 1, 1);
    i++;
  });

  test("Scenario 1: Player 1 moves and catches the ChaseObject", async () => {
    game.movePlayer("1", { lat: 5, lon: 5 });
    game.movePlayer("2", { lat: 1, lon: 1 });
    game.movePlayer("3", { lat: 2, lon: 1 });
    game.movePlayer("4", { lat: 1, lon: 1 });

    const res2 = game.catchChaseObject("2");
    const res3 = game.catchChaseObject("3");
    const res4 = game.catchChaseObject("4");
    const res1 = game.catchChaseObject("1");

    expect(res1).toEqual(true);
    expect(res2).toEqual(false);
    expect(res3).toEqual(false);
    expect(res4).toEqual(false);
    expect(game.getGuardian().pseudo).toEqual("player1");
  });

  test("Scenario 2: Player 1 moves and catches the ChaseObject, Player2 steals him", async () => {
    game.movePlayer("1", { lat: 5, lon: 5 });
    game.movePlayer("2", { lat: 1, lon: 1 });
    game.movePlayer("3", { lat: 1, lon: 1 });
    game.movePlayer("4", { lat: 3, lon: 0 });

    const res2 = game.catchChaseObject("2");
    const res3 = game.catchChaseObject("3");
    const res4 = game.catchChaseObject("4");
    const res1 = game.catchChaseObject("1");
    expect(res1).toEqual(true);
    expect(res2).toEqual(false);
    expect(res3).toEqual(false);
    expect(res4).toEqual(false);
    expect(game.getGuardian().pseudo).toEqual("player1");

    game.movePlayer("2", { lat: 5, lon: 5 });
    const resSteal = game.stealChaseObject("2");
    expect(resSteal).toEqual( true);
    expect(game.getGuardian().pseudo).toEqual( "player2");
  });

  test("Scenario 3: Guardian Reset => Player 1 moves and catches the ChaseObject, Player2 steals him and exit the area, ChaseObject backs randomly in the map", async () => {
    const chaseobjectloc = game.getChaseObjectLocation();
    game.movePlayer("1", { lat: 5, lon: 5 });
    game.movePlayer("2", { lat: 1, lon: 1 });
    game.movePlayer("3", { lat: 2, lon: 1 });
    game.movePlayer("4", { lat: 5, lon: 10 });

    const res1 = game.catchChaseObject("1");
    expect(res1).toEqual( true);
    game.movePlayer("2", { lat: 5, lon: 5 });
    const resSteal = game.stealChaseObject("2");
    expect(resSteal).toEqual( true);
    expect(game.getGuardian().pseudo).toEqual( "player2");
    game.movePlayer("2", { lat: 11, lon: 11 });
    expect(chaseobjectloc).not.toEqual(game.getChaseObjectLocation());
    expect(game.getGuardian()).toEqual( null);
  });

  test("Scenario 4: Announcing the winner and scoreboard", async () => {
    const chaseobjectloc = game.getChaseObjectLocation();
    game.movePlayer("1", { lat: 5, lon: 5 });
    game.movePlayer("2", { lat: 2, lon: 1 });
    game.movePlayer("3", { lat: 2, lon: 1 });
    game.movePlayer("4", { lat: 2, lon: 2 });

    const res1 = game.catchChaseObject("1");
    expect(res1).toEqual( true);
    game.movePlayer("2", { lat: 5, lon: 5 });
    const resSteal = game.stealChaseObject("2");
    expect(resSteal).toEqual( true);
    expect(game.getGuardian().pseudo).toEqual( "player2");
    game.movePlayer("2", { lat: 1, lon: 1 });
    game.movePlayer("2", { lat: 2, lon: 2 });
    game.movePlayer("2", { lat: 3, lon: 3 });
    game.movePlayer("1", { lat: 3, lon: 3 });
    const resStealPlayer1 = game.stealChaseObject("1");
    game.movePlayer("3", { lat: 3, lon: 3 });
    game.movePlayer("1", { lat: 4, lon: 4 });
    const resStealPlayer3 = game.stealChaseObject("3");
    expect(resStealPlayer3).toEqual( false);
    game.movePlayer("4", { lat: 4, lon: 4 });
    const resStealPlayer4 = game.stealChaseObject("4");
    expect(resStealPlayer4).toEqual( true);
    expect(game.getGuardian().getPseudo()).toEqual( "player4");
    const { totalCatchs, totalSteals, totalSkillsUsed } = getResults(
      game.getHistory()
    );
    expect(totalCatchs).toEqual( 1);
    expect(totalSteals).toEqual( 3);
    expect(totalSkillsUsed).toEqual( 0);
  });
});
