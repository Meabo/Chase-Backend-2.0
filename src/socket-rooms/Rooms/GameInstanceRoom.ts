import { Room, Client, Delayed  } from "colyseus";
//import Game from "../GameLogic/Game";
import {GameSchema} from "../ColyseusSchema/GameSchema"
import {UserLocation} from "../ColyseusSchema/Userlocation"
import {InitGameCommand, CreatePlayerCommand, RemovePlayerCommand, CatchChaseObjectCommand, StealChaseObjectCommand, MoveCommand} from "../Commands/GameCommands"
import { Dispatcher } from "@colyseus/command";

export class GameInstance extends Room<GameSchema> {
  // When room is initialized

  public delayedInterval!: Delayed;
  dispatcher = new Dispatcher(this);

  onCreate(options: any) {
    console.log('Current options', JSON.stringify(options))
    const gameSchema = new GameSchema();
    gameSchema.gameId = options.gameId;
    this.setState(gameSchema);

    this.beginGame(options.time, options.gameId);

    this.onMessage("move", (client, position: UserLocation) => {
      //this.state.movePlayer(client.sessionId, position);
      this.dispatcher.dispatch(new MoveCommand(), {playerId: client.sessionId, position})
    });
    this.onMessage("catch", (client, value) => {
      //this.state.catchChaseObject(client.sessionId);
      this.dispatcher.dispatch(new CatchChaseObjectCommand(), {playerId: client.sessionId})
    });
    this.onMessage("steal", (client, value) => {
      //this.state.stealChaseObject(client.sessionId);
      this.dispatcher.dispatch(new StealChaseObjectCommand(), {playerId: client.sessionId})

    });
  }
  // Checks if a new client is allowed to join. (default: `return true`)
  requestJoin(options: any, isNew: boolean) {
    return true;
  }
  // Authorize client based on provided options before WebSocket handshake is complete
  /*onAuth(options) */
  beginGame(time: number, gameId: string) {
    this.clock.start();
    this.clock.setTimeout(() => {
      this.broadcast("gameBegins", time)
      this.dispatcher.dispatch(new InitGameCommand(), {fetch: true, gameId})
      console.log("gameBegins");
    }, 10 * 1000);
    this.clock.setTimeout(() => this.finishedGame(), time * 1000);
  }

  finishedGame() {
    console.log("gameFinished");
    this.broadcast("gameFinished");
  }
  // When client successfully join the room
  onJoin(client: Client, options: any, auth) {
    console.log(`${client.id} joined GameInstance.`);
    if (
      !options ||
      options.playerId == null ||
      options.pseudo == null ||
      options.lat == null ||
      options.lon == null
    )
      throw new Error("Player doesn't have a pseudo, or a position");

    const { playerId, pseudo, lat, lon } = options;
    this.dispatcher.dispatch(new CreatePlayerCommand(), {playerId: client.sessionId, pseudo, lat, lon})
  }

  // When a client leaves the room
  onLeave(client: Client, consented: boolean) {
    console.log("onLeave", client.id, consented);
    this.dispatcher.dispatch(new RemovePlayerCommand(), {playerId: client.sessionId});
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {
    console.log('onDispose')
  }
}
