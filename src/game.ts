import {Schema, type, ArraySchema, MapSchema} from "@colyseus/schema";
import History from "./history";
import Player from "./player";
import ChaseObject from "./chaseobject";
import {getGameById, IGame} from "./models/game"
import {timer} from "rxjs";
import Area from "./area";
import {
  distance,
  distanceByLoc,
  calcRandomPointInTriangle,
  robustPointInPolygon
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

  private area: Area;
  private timer;
  private alreadyGuardian: boolean = false;
  private gameId: string;
  private generateChaseObjectDelay: number = 3000;
  private distanceToCatch: number = 10000;
  private distanceToSteal: number = 10000;
  private scoreCatch: number = 1000;
  private scoreSteal: number = 1000;

  constructor(options: any) {
    super();
    if (options.fetch) {
      this.fetchGameFromDb(options.name);
      return;
    }
    this.createGameWithOptions(options);
  }

  createGameWithOptions(options: any) {
    this.area = new Area(options.name, options.arealoc, options.bounds);
    this.chaseObject = new ChaseObject(options.chaseObjectLoc[0], options.chaseObjectLoc[1]);
    this.timer = null;
    this.gameId = options.gameId;
  }


  fetchGameFromDb(name: string) {
    getGameById(name).then((game: IGame) => {
      this.area = new Area(game.area.name, game.area.location.coordinates, game.area.bounds.coordinates);
      this.timer = null;
      this.gameId = game.id;
      setTimeout(() => this.chaseObject = this.generatePositionForChaseObject(), this.generateChaseObjectDelay)
    }).catch((err) => {throw new Error(err)})
  }

  setArea(area: Area) {
    this.area = new Area(area.getName(), area.getLocation(), area.getBounds());
  }

  setChaseObject(chaseObject: ChaseObject) {
    this.chaseObject = new ChaseObject(chaseObject.getLocation()[0], chaseObject.getLocation()[1]);
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
      if (distance < this.distanceToCatch) {
        console.log("you got it", id);
        // in meters
        this.guardian = new Player(pseudo, lat, lon);
        this.chaseObject = null;
        this.alreadyGuardian = true;
        result = true;
        this.players[id].score += this.scoreCatch;
      }
      else {
        console.log("Catch did not happen, too far", "distance is too far: " + distance);
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
    if (!this.guardian) return;
    const {pseudo, lat, lon} = this.players[id];
    const {pseudo: guardianPseudo} = this.guardian;
    let result = false;
    const distance = distanceByLoc(
      this.players[id].getLocation(),
      this.guardian.getLocation()
    );
    if (distance < this.distanceToSteal) {
      this.guardian = new Player(pseudo, lat, lon);
      result = true;
      this.players[id].score += this.scoreSteal;
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
    const triangles = this.area.getTriangles();
    const {latitude, longitude} = calcRandomPointInTriangle(triangles);
    return  new ChaseObject(latitude, longitude);
  }

  generateAnotherPositionForChaseObject() {
    this.chaseObject = this.generatePositionForChaseObject()
    this.guardian = null;
    this.alreadyGuardian = false;
  }

  movePlayer(id: string, payload: any) {
    const {pseudo, lat, lon} = this.players[id];
    const {lat: newlat, lon: newlon, speed} = payload;
    if (lat && lon && newlat && newlon) {
      const distanceTraveled = distance(lat, lon, newlat, newlon) / 1000
      this.players[id].lat = newlat;
      this.players[id].lon = newlon;
      this.players[id].distance += distanceTraveled
      this.players[id].score += distanceTraveled / 10;
      this.history.addMove(
        this.gameId,
        id,
        [lat, lon],
        [newlat, newlon],
        new Date().getTime(),
        speed
      );
    }
   
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
