import {Schema, type, ArraySchema, MapSchema} from "@colyseus/schema";
import History from "./history";
import Player from "./player";
import ChaseObject from "./chaseobject";
import {timer, pipe, from, Observable} from "rxjs";
const {take, finalize, mergeMap} = require("rxjs/operators");

export default class Game extends Schema {
  @type([History])
  history = new ArraySchema<History>();

  @type({map: Player})
  players = new MapSchema<Player>();

  @type("boolean")
  finished = false;

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
          console.log("timer finished");
          this.finished = true;
          console.log("finished");
        })
      )
      .subscribe();
  }

  createPlayer(id: string, pseudo: string, lat: number, lon: number) {
    this.players[id] = new Player(pseudo, lat, lon);
  }

  async catchChaseObject(id: string, payload: any) {
    const {lat, lon} = payload;
    if (this.chaseObject.lat === lat && this.chaseObject.lon === lon) {
      const {pseudo, lat, lon} = this.players[id];
      this.finished = true;
      this.guardian = new Player(pseudo, lat, lon);
      //await this.BeginTimer(1, 200);
      return true;
    }
    return false;
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
