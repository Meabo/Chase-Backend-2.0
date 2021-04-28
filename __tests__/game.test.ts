import Area from "../src/socket-rooms/ColyseusSchema/area";
import ChaseObject from "../src/socket-rooms/ColyseusSchema/ChaseObject";
import { GameSchema } from "../src/socket-rooms/ColyseusSchema/GameSchema";
import { UserLocation } from "../src/socket-rooms/ColyseusSchema/Userlocation";
import {InitGameCommand, ChaseObjectMoveCommandMocked, CreatePlayerCommand, RemovePlayerCommand, CatchChaseObjectCommand, StealChaseObjectCommand, MoveCommand} from "../src/socket-rooms/Commands/GameCommands"
import { getResults } from "../src/utils/results";
import {Room, Client} from "./mock/colyseus"
import { Dispatcher } from "@colyseus/command";

describe("Game Scenarios", () => {
  let game: GameSchema;
  let i = 1;
  const loc = [5, 5];
  const polygon = [
    [0, 0],
    [0, 10],
    [10, 10],
    [10, 0],
  ];
  let room: Room<GameSchema>;


  beforeEach(() => {
    const options = {
      name: "area",
      chaseObject: {
        lat: 1,
        lon: 1
      },
      lat: loc[0],
      lon: loc[1],
      gameId: i,
      bounds: polygon,
    };

    room = new Room<GameSchema>();
    game = new GameSchema().assign({gameId: `${options.gameId}`});
    room.setState(game);
    const dispatcher = new Dispatcher(room);
    dispatcher.dispatch(new InitGameCommand(), {fetch: false, gameId: i, options})
    dispatcher.dispatch(new CreatePlayerCommand(), {playerId: "1", pseudo: `player${1}`, lat: 1, lon: 1})
    dispatcher.dispatch(new CreatePlayerCommand(), {playerId: "2", pseudo: `player${2}`, lat: 1, lon: 1})
    dispatcher.dispatch(new CreatePlayerCommand(), {playerId: "3", pseudo: `player${3}`, lat: 1, lon: 1})
    dispatcher.dispatch(new CreatePlayerCommand(), {playerId: "4", pseudo: `player${4}`, lat: 1, lon: 1})
    i++;
  });

  test("Scenario 1: Player 1 moves and catches the ChaseObject", async () => {
    const dispatcher = new Dispatcher(room);

    dispatcher.dispatch(new MoveCommand(), {playerId: "1", position: new UserLocation().assign({lat: 5, lon: 5, speed: 10})})
    dispatcher.dispatch(new MoveCommand(), {playerId: "2", position: new UserLocation().assign({lat: 1, lon: 1, speed: 10})})
    dispatcher.dispatch(new MoveCommand(), {playerId: "3", position: new UserLocation().assign({lat: 2, lon: 1, speed: 10})})
    dispatcher.dispatch(new MoveCommand(), {playerId: "4", position: new UserLocation().assign({lat: 1, lon: 1, speed: 10})})

    dispatcher.dispatch(new CatchChaseObjectCommand(),{playerId: "1"})
    dispatcher.dispatch(new CatchChaseObjectCommand(),{playerId: "2"})
    dispatcher.dispatch(new CatchChaseObjectCommand(),{playerId: "3"})
    dispatcher.dispatch(new CatchChaseObjectCommand(),{playerId: "4"})

   /* expect(res1).toEqual(true);
    expect(res2).toEqual(false);
    expect(res3).toEqual(false);
    expect(res4).toEqual(false);*/
    expect(room.state.guardian.pseudo).toEqual("player2");
  });

  test("Scenario 2: Player 1 moves and catches the ChaseObject, Player2 steals him", async () => {
    const dispatcher = new Dispatcher(room);

    dispatcher.dispatch(new MoveCommand(), {playerId: "1", position: new UserLocation().assign({lat: 5, lon: 5, speed: 10})})
    dispatcher.dispatch(new MoveCommand(), {playerId: "2", position: new UserLocation().assign({lat: 1, lon: 1, speed: 10})})
    dispatcher.dispatch(new MoveCommand(), {playerId: "3", position: new UserLocation().assign({lat: 1, lon: 1, speed: 10})})
    dispatcher.dispatch(new MoveCommand(), {playerId: "4", position: new UserLocation().assign({lat: 3, lon: 0, speed: 10})})


    dispatcher.dispatch(new CatchChaseObjectCommand(), {playerId: "2"})
    dispatcher.dispatch(new CatchChaseObjectCommand(), {playerId: "3"})
    dispatcher.dispatch(new CatchChaseObjectCommand(), {playerId: "4"})
    dispatcher.dispatch(new CatchChaseObjectCommand(), {playerId: "1"})

    expect(room.state.guardian.pseudo).toEqual("player2");


    dispatcher.dispatch(new MoveCommand(), {playerId: "2", position: new UserLocation().assign({lat: 5, lon: 5, speed: 10})})
    dispatcher.dispatch(new StealChaseObjectCommand(), {playerId: "2"})
    expect(room.state.guardian.pseudo).toEqual( "player2");
  });

  test("Scenario 3: Guardian Reset => Player 1 moves and catches the ChaseObject, Player2 steals him and exit the area, ChaseObject backs randomly in the map", async () => {
    
    const dispatcher = new Dispatcher(room);

    dispatcher.dispatch(new MoveCommand(), {playerId: "1", position: new UserLocation().assign({lat: 1, lon: 1, speed: 10})})
    dispatcher.dispatch(new MoveCommand(), {playerId: "2", position: new UserLocation().assign({lat: 1, lon: 1, speed: 10})})
    dispatcher.dispatch(new MoveCommand(), {playerId: "3", position: new UserLocation().assign({lat: 2, lon: 1, speed: 10})})
    dispatcher.dispatch(new MoveCommand(), {playerId: "4", position: new UserLocation().assign({lat: 5, lon: 10, speed: 10})})

    const chaseobjectloc = room.state.chaseObject.getLocation();
    dispatcher.dispatch(new CatchChaseObjectCommand(), {playerId: "1"})
    dispatcher.dispatch(new MoveCommand(), {playerId: "1", position: new UserLocation().assign({lat: 5, lon: 5, speed: 10})})


    //const res1 = game.catchChaseObject("1");
    //expect(res1).toEqual( true);
    dispatcher.dispatch(new MoveCommand(), {playerId: "2", position: new UserLocation().assign({lat: 5, lon: 5, speed: 10})})
    dispatcher.dispatch(new StealChaseObjectCommand(), {playerId: "2"})

    //game.movePlayer("2", { lat: 5, lon: 5 });
    //const resSteal = game.stealChaseObject("2");
    //expect(resSteal).toEqual( true);
    expect(room.state.guardian.pseudo).toEqual( "player2");
    dispatcher.dispatch(new MoveCommand(), {playerId: "2", position: new UserLocation().assign({lat: 11, lon: 11, speed: 10})})
    expect(chaseobjectloc).not.toEqual(room.state.getChaseObjectLocation());
    expect(room.state.guardian).toEqual( null);
  });

  test("Scenario 4: Announcing the winner and scoreboard", async () => {
    const chaseobjectloc = room.state.getChaseObjectLocation();
    const dispatcher = new Dispatcher(room);

    dispatcher.dispatch(new MoveCommand(), {playerId: "1", position: new UserLocation().assign({lat: 1, lon: 1, speed: 10})})
    dispatcher.dispatch(new MoveCommand(), {playerId: "2", position: new UserLocation().assign({lat: 2, lon: 1, speed: 10})})
    dispatcher.dispatch(new MoveCommand(), {playerId: "3", position: new UserLocation().assign({lat: 2, lon: 1, speed: 10})})
    dispatcher.dispatch(new MoveCommand(), {playerId: "4", position: new UserLocation().assign({lat: 5, lon: 2, speed: 10})})

    //const res1 = game.catchChaseObject("1");
   // expect(res1).toEqual( true);
   dispatcher.dispatch(new CatchChaseObjectCommand(), {playerId: "1"})

   dispatcher.dispatch(new MoveCommand(), {playerId: "2", position: new UserLocation().assign({lat: 1, lon: 1, speed: 10})})
   dispatcher.dispatch(new StealChaseObjectCommand(), {playerId: "2"})

    //const resSteal = game.stealChaseObject("2");
    //expect(resSteal).toEqual( true);
    expect(room.state.guardian.pseudo).toEqual( "player2");
    dispatcher.dispatch(new MoveCommand(), {playerId: "2", position: new UserLocation().assign({lat: 1, lon: 1, speed: 10})})
    dispatcher.dispatch(new MoveCommand(), {playerId: "2", position: new UserLocation().assign({lat: 2, lon: 2, speed: 10})})
    dispatcher.dispatch(new MoveCommand(), {playerId: "2", position: new UserLocation().assign({lat: 3, lon: 3, speed: 10})})
    dispatcher.dispatch(new MoveCommand(), {playerId: "1", position: new UserLocation().assign({lat: 3, lon: 3, speed: 10})})

    dispatcher.dispatch(new StealChaseObjectCommand(), {playerId: "1"})
    dispatcher.dispatch(new MoveCommand(), {playerId: "3", position: new UserLocation().assign({lat: 3, lon: 3, speed: 10})})
    dispatcher.dispatch(new MoveCommand(), {playerId: "1", position: new UserLocation().assign({lat: 4, lon: 4, speed: 10})})

    dispatcher.dispatch(new StealChaseObjectCommand(), {playerId: "3"})
    dispatcher.dispatch(new MoveCommand(), {playerId: "4", position: new UserLocation().assign({lat: 4, lon: 4, speed: 10})})


    dispatcher.dispatch(new StealChaseObjectCommand(), {playerId: "4"})

    //const resStealPlayer3 = game.stealChaseObject("3");
    //expect(resStealPlayer3).toEqual( false);
    //const resStealPlayer4 = game.stealChaseObject("4");
    //expect(resStealPlayer4).toEqual( true);
    expect(room.state.guardian.pseudo).toEqual( "player4");
    const { totalCatchs, totalSteals, totalSkillsUsed } = getResults(
      room.state.history
    );
    expect(totalCatchs).toBe(1);
    expect(totalSteals).toBe(3);
    expect(totalSkillsUsed).toBe(0);
  });
});
