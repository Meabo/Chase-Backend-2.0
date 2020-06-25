import {Schema, type, ArraySchema, MapSchema} from "@colyseus/schema";
import History from "./history";
import Player from "./player";
import ChaseObject from "./chaseobject";
import {getGameById, IGame} from "./models/game"
import {timer} from "rxjs";
import Area from "./area";
import {
  distanceByLoc,
  robustPointInPolygon,
  calcRandomPointInTriangle
} from "./utils/locationutils";

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

  constructor(options: any) {
    super();
    getGameById(options.name).then((game: IGame) => {
      this.chaseObject = this.generatePositionForChaseObject()
      this.timer = null;
      this.gameId = game.id;
      this.area = new Area(game.area.name, game.area.location, game.area.bounds);
    })
  }

  createPlayer(id: string, pseudo: string, lat: number, lon: number) {
    this.players[id] = new Player(pseudo, lat, lon);
  }

  catchChaseObject(id: string) {
    let result = false;
    const {pseudo, lat, lon} = this.players[id];
    if (this.alreadyGuardian === false) {
      const distance = distanceByLoc(
        [lat, lon],
        this.chaseObject.getLocation()
      );
      if (distance < 10) {
        // in meters
        this.guardian = new Player(pseudo, lat, lon);
        this.alreadyGuardian = true;
        result = true;
        //await this.BeginTimer(1, 100); // Value to change with a real timer
      }
      this.history.addAction(this.gameId, id, "catch", {
        status: result ? "success" : "failure",
        pseudo,
        location: [lat, lon],
        timestamp: new Date().getTime()
      });
    }
    return result;
  }

  stealChaseObject(id: string) {
    const {pseudo, lat, lon} = this.players[id];
    const {pseudo: guardianPseudo} = this.guardian;
    let result = false;
    const distance = distanceByLoc(
      this.players[id].getLocation(),
      this.guardian.getLocation()
    );
    if (distance < 10) {
      this.guardian = new Player(pseudo, lat, lon);
      result = true;
    }
    this.history.addAction(this.gameId, id, "steal", {
      status: result ? "success" : "failure",
      pseudo,
      pseudoStealed: guardianPseudo,
      location: [lat, lon],
      timestamp: new Date().getTime()
    });
    return result;
  }

  removePlayer(id: string) {
    delete this.players[id];
  }

  generatePositionForChaseObject() {
    const {latitude, longitude} = calcRandomPointInTriangle(this.area.getTriangles());
    return new ChaseObject(latitude, longitude);
  }

  generateAnotherPositionForChaseObject() {
    this.chaseObject = this.generatePositionForChaseObject()
    this.guardian = null;
    this.alreadyGuardian = false;
  }

  movePlayer(id: string, payload: any) {
    const {lat, lon} = this.players[id];
    const {lat: newlat, lon: newlon, speed} = payload;
    this.players[id].lat = newlat;
    this.players[id].lon = newlon;
    this.history.addMove(
      this.gameId,
      id,
      [lat, lon],
      [newlat, newlon],
      new Date().getTime(),
      speed
    );
    if (
      this.alreadyGuardian &&
      this.players[id].pseudo === this.guardian.pseudo
    ) {
      this.guardian.lat = newlat;
      this.guardian.lon = newlon;
    }
    if (
      this.alreadyGuardian &&
      this.players[id].pseudo === this.guardian.pseudo &&
      !this.area.isInside([newlat, newlon])
    ) {
      this.generateAnotherPositionForChaseObject();
    }
  }

  getGuardian() {
    return this.guardian;
  }

  getHistory() {
    return this.history;
  }

  getChaseObjectLocation() {
    return this.chaseObject.getLocation();
  }
}
