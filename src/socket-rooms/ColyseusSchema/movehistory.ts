import {Schema, type, ArraySchema} from "@colyseus/schema";
import {Location} from "./Location";

export default class Move extends Schema {
  @type("string")
  private gameId: string;
  
  @type("string")
  private playerId: string;
  
  @type(Location)
  private prevLocation: Location;

  @type(Location)
  private newLocation: Location;
  
  @type("float32")
  private timestamp: number;

  @type("float32")
  private speed: number;

  getPrevLocation() {
    return this.prevLocation.getLocation();
  }

  getNewLocation() {
    return this.newLocation.getLocation();
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
