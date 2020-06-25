import {Schema, type, ArraySchema, MapSchema} from "@colyseus/schema";
import History from "./history";
import Player from "./player";
import ChaseObject from "./chaseobject";
import Area from "./area";
import {
  distance,
  distanceByLoc,
  calcRandomPointInTriangle,
  robustPointInPolygon
} from "./utils/locationutils";
import {getResultsSolo} from "./resultsSolo";


enum AvailableAreas {
  CHAMP_DE_MARS
}


export default class GameSolo extends Schema {
  private history: History = new History();

  @type(Player)
  player: Player;

  @type("boolean")
  private gameFinished: boolean = false;

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
    const {playerId} = options;
    this.area = this.selectArea(0) // ChampsDeMars by default
    const chaseObjectLocation = calcRandomPointInTriangle(this.area.getTriangles());
    this.chaseObject = new ChaseObject(chaseObjectLocation.latitude, chaseObjectLocation.longitude);
    this.gameId = playerId;
  }

  createChampsDeMars() {
    const center = [48.8556475, 2.2986304];
    const top_left = [48.8569443, 2.2940138];
    const top_right = [48.8586221, 2.2963717];
    const bot_right = [48.8539637, 2.3035665];
    const bot_left = [48.8523546, 2.3012814];

    const bounds = [top_left, top_right, bot_right, bot_left, top_left];
    return new Area("ChampsDeMars", center, bounds, );
  }

  selectArea(choosenArea) {
    switch (choosenArea) {
      case AvailableAreas.CHAMP_DE_MARS: return this.createChampsDeMars();
    }
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

  catchChaseObject(id: string) {
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
      this.player.score += 100;
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
    let latitude, longitude;
    while (true) {
      let result = calcRandomPointInTriangle(this.area.getTriangles());
      if (robustPointInPolygon(this.area.getBounds(), [result.latitude, result.longitude]) === -1) {
        latitude = result.latitude;
        longitude = result.longitude
        break;
      }
    }    
    this.chaseObject = new ChaseObject(latitude, longitude);
  }

  movePlayer(id: string, payload: any) {
    const {lat, lon} = this.player;
    const {lat: newlat, lon: newlon, speed} = payload;
    this.player.lat = newlat;
    this.player.lon = newlon;

    if (lat && lon && newlat && newlon) {
      this.player.distance += (distance(lat, lon, newlat, newlon) / 1000)
      this.history.addMove(
        this.gameId,
        id,
        [lat, lon],
        [newlat, newlon],
        new Date().getTime(),
        speed
      );
    }
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

  getCurrentBounds() {
    return this.area.getBounds();
  }

  getAreaTriangles() {
    return this.area.getTriangles();
  }
}
