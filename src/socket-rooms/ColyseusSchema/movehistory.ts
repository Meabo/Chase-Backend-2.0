import {Schema, type, ArraySchema} from "@colyseus/schema";
import {Location} from "./Location";

export default class Move extends Schema {
  @type("string")
  private gameId: string;
  
  @type("string")
  private playerId: string;
  
  @type(Location)
  private prevlocation: Location;

  @type(Location)
  private newlocation: Location;
  
  @type("float32")
  private timestamp: number;

  @type("float32")
  private speed: number;

  constructor(
    gameId: string,
    playerId: string,
    prevLocation: number[],
    newLocation: number[],
    timestamp: number,
    speed: number
  ) {
    super();
    this.gameId = gameId;
    this.playerId = playerId;
    this.prevlocation = new Location(prevLocation[0], prevLocation[1]);
    this.newlocation = new Location(newLocation[0], newLocation[1]);
    this.timestamp = timestamp;
    this.speed = speed;
  }

  getPrevLocation() {
    return this.prevlocation.getLocation();
  }

  getNewLocation() {
    return this.newlocation.getLocation();
  }

  getPlayerId() {
    return this.playerId;
  }

  getSpeed() {
    return this.speed;
  }

  getTimestamp() {
    return this.timestamp;
  }
}
