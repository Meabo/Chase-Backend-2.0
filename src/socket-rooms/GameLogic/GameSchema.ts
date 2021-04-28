import { Schema, type, MapSchema } from "@colyseus/schema";
import History from "../ColyseusSchema/History";
import Player from "../ColyseusSchema/PlayerGame";
import ChaseObject from "../ColyseusSchema/ChaseObject";
import Area from "../ColyseusSchema/Area";

export class GameSchema extends Schema {
  @type("string")
  gameId: string;

  @type(History)
  history: History = new History();

  @type({ map: Player })
  players = new MapSchema<Player>();

  @type("boolean")
  gameFinished: boolean = false;

  @type(ChaseObject)
  chaseObject: ChaseObject;

  @type(Player)
  guardian: Player = null;

  @type(Area)
  area: Area = null;

  isAlreadyGuardian() {
    return !!this.guardian;
  }

  getChaseObjectLocation() {
    return this.chaseObject.getLocation();
  }
}

