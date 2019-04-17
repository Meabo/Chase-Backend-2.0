import {Schema, type, ArraySchema, MapSchema} from "@colyseus/schema";
import History from "./history";
import Player from "./player";
import ChaseObject from "./chaseobject";
import {timer} from "rxjs";
import Area from "./area";
import {
  robustPointInPolygon,
  getRandomLocationInsidePolygon
} from "./utils/locationutils";
const {take, finalize} = require("rxjs/operators");

export default class Game extends Schema {
  @type(History)
  private history: History = new History();
  @type({map: Player})
  players = new MapSchema<Player>();

  @type("boolean")
  private gameFinished: boolean = false;
  @type(ChaseObject)
  chaseObject: ChaseObject;
  @type(Player)
  private guardian: Player;

  @type(Area)
  private area: Area;

  private timer;
  private alreadyGuardian: boolean = false;
  private gameId: string;

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

  async catchChaseObject(id: string) {
    let result = false;
    if (this.alreadyGuardian === false) {
      const {pseudo, lat, lon} = this.players[id];
      if (this.chaseObject.lat === lat && this.chaseObject.lon === lon) {
        this.guardian = new Player(pseudo, lat, lon);
        this.alreadyGuardian = true;
        result = true;
        await this.BeginTimer(1, 100); // Value to change with a real timer
        return true;
      }
      this.history.addAction(this.gameId, id, "catch", {
        status: result ? "success" : "failure",
        pseudo,
        location: [lat, lon],
        timestamp: new Date().getTime()
      });
      return false;
    }
    return false;
  }

  stealChaseObject(id: string) {
    const {pseudo, lat, lon} = this.players[id];
    const guardianPseudo = this.guardian.pseudo;
    let result = false;
    if (this.guardian.lat === lat && this.guardian.lon === lon) {
      this.guardian = new Player(pseudo, lat, lon);
      result = true;
      return result;
    }
    this.history.addAction(this.gameId, id, "steal", {
      status: result ? "success" : "failure",
      pseudo,
      pseudoStealed: guardianPseudo,
      location: [lat, lon],
      timestamp: new Date().getTime()
    });
    return false;
  }

  removePlayer(id: string) {
    delete this.players[id];
  }

  generateAnotherPositionForChaseObject() {
    const {latitude, longitude} = getRandomLocationInsidePolygon(
      this.area.getBounds()
    );
    this.chaseObject = new ChaseObject(latitude, longitude);
  }

  movePlayer(id: string, payload: any) {
    const {pseudo, lat, lon} = this.players[id];
    const {lat: newlat, lon: newlon} = payload;
    this.players[id].lat = newlat;
    this.players[id].lon = newlon;
    this.history.addMove(
      this.gameId,
      id,
      [lat, lon],
      [newlat, newlon],
      new Date().getTime()
    );

    if (
      this.alreadyGuardian &&
      this.players[id].pseudo === this.guardian.pseudo &&
      !this.area.isInside()
    ) {
      this.generateAnotherPositionForChaseObject();
    }
  }

  constructor(options: any) {
    super();
    const {chaseObjectLoc, gameId, arealoc, bounds} = options;
    this.chaseObject = new ChaseObject(chaseObjectLoc[0], chaseObjectLoc[1]);
    this.timer = null;
    this.gameId = gameId;
    this.area = new Area(arealoc, bounds, "area");
  }

  getGuardian() {
    return this.guardian;
  }

  getHistory() {
    return this.history.getHistory();
  }
}
