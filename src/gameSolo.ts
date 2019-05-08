import {Schema, type, ArraySchema, MapSchema} from "@colyseus/schema";
import History from "./history";
import Player from "./player";
import ChaseObject from "./chaseobject";
import {timer} from "rxjs";
import Area from "./area";
import {
  distanceByLoc,
  robustPointInPolygon,
  getRandomLocationInsidePolygon
} from "./utils/locationutils";
const {take, finalize} = require("rxjs/operators");
import {getResultsSolo} from "./resultsSolo";

export default class GameSolo extends Schema {
  private history: History = new History();

  @type(Player)
  player: Player;

  @type("boolean")
  private gameFinished: boolean = false;

  @type("number")
  score: number = 0;

  @type(ChaseObject)
  chaseObject: ChaseObject;

  @type(Area)
  private area: Area;

  private gameId: string;
  options = {
    range: 1000, // in Meters
    pointUnity: 100
  };

  constructor(options: any) {
    super();
    const {chaseObjectLoc, gameId, arealoc, bounds} = options;
    this.chaseObject = new ChaseObject(chaseObjectLoc[0], chaseObjectLoc[1]);
    this.gameId = gameId;
    this.area = new Area(arealoc, bounds, "area");
  }

  createPlayer(id: string, pseudo: string, lat: number, lon: number) {
    this.player = new Player(pseudo, lat, lon);
    console.log("Player created");
    this.history.addMove(
      this.gameId,
      id,
      [lat, lon],
      [lat, lon],
      new Date().getTime(),
      0
    );
  }

  async catchChaseObject(id: string) {
    let result = false;
    const {pseudo, lat, lon} = this.player;
    const chaseObjectLocation = this.chaseObject.getLocation();
    console.log("CatchObject", pseudo, lat, lon);
    const distance = distanceByLoc([lat, lon], chaseObjectLocation);
    console.log("Distance catch", distance);
    if (distance < this.options.range) {
      // in meters
      console.log("Catch success");
      result = true;
      this.score += 100;
      this.generateAnotherPositionForChaseObject();
      // Value to change with a real timer
    }
    this.history.addAction(this.gameId, id, "catch", {
      status: result ? "success" : "failure",
      pseudo,
      location: [lat, lon],
      timestamp: new Date().getTime(),
      chaseObjectLocation: chaseObjectLocation
    });
    return result;
  }

  removePlayer(id: string) {
    delete this.player;
  }

  generateAnotherPositionForChaseObject() {
    const {latitude, longitude} = getRandomLocationInsidePolygon(
      this.area.getBounds()
    );
    this.chaseObject = new ChaseObject(latitude, longitude);
  }

  movePlayer(id: string, payload: any) {
    const {lat, lon} = this.player;
    const {lat: newlat, lon: newlon, speed} = payload;
    this.player.lat = newlat;
    this.player.lon = newlon;
    this.history.addMove(
      this.gameId,
      id,
      [lat, lon],
      [newlat, newlon],
      new Date().getTime(),
      speed
    );
    console.log("Move : Player", id, newlat, newlon);
  }

  getResult() {
    return getResultsSolo(this.history, this.options.pointUnity);
  }

  getHistory() {
    return this.history;
  }

  getChaseObjectLocation() {
    return this.chaseObject.getLocation();
  }
}
