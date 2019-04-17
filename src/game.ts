import {Schema, type, ArraySchema, MapSchema} from "@colyseus/schema";
import History from "./history";
import Player from "./player";
import ChaseObject from "./chaseobject";
import {timer} from "rxjs";
const {take, finalize} = require("rxjs/operators");

export default class Game extends Schema {
  @type([History])
  history = new ArraySchema<History>();

  @type({map: Player})
  players = new MapSchema<Player>();

  private alreadyGuardian: boolean = false;

  @type("boolean")
  gameFinished: boolean = false;

  @type(ChaseObject)
  chaseObject: ChaseObject;

  @type(Player)
  guardian: Player;

  timer;

  async BeginTimer(limit, ticker) {
    this.timer = timer(0, ticker)
      .pipe(
        take(limit),
        finalize(() => {
          this.gameFinished = true;
        })
      )
      .subscribe();
  }

  createPlayer(id: string, pseudo: string, lat: number, lon: number) {
    this.players[id] = new Player(pseudo, lat, lon);
  }

  async catchChaseObject(id: string, payload: any) {
    if (this.alreadyGuardian === false) {
      const {lat, lon} = payload;
      if (this.chaseObject.lat === lat && this.chaseObject.lon === lon) {
        const {pseudo, lat, lon} = this.players[id];
        this.guardian = new Player(pseudo, lat, lon);
        this.alreadyGuardian = true;
        await this.BeginTimer(1, 100); // Value to change with a real timer
        return true;
      }
      return false;
    }
  }

  stealChaseObject(id: string, payload: any) {
    const {lat, lon} = payload;
    if (this.guardian.lat === lat && this.guardian.lon === lon) {
      const {pseudo, lat, lon} = this.players[id];
      this.guardian = new Player(pseudo, lat, lon);
      return true;
    }
    return false;
  }

  removePlayer(id: string) {
    delete this.players[id];
  }

  movePlayer(id: string, payload: any) {
    const {lat, lon} = payload;
    this.players[id].lat = lat;
    this.players[id].lon = lon;
  }
  constructor(options: any) {
    super();
    this.chaseObject = new ChaseObject(1, 1);
    this.timer = null;
  }
}
