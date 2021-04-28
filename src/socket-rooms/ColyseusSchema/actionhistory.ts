import {Schema, type, ArraySchema} from "@colyseus/schema";
import {Location} from "./Location";

export default class Action extends Schema {
  @type("string")
  private gameId: string;
  
  @type("string")
  private playerId: string;

  @type("string")
  private status: string;

  @type("string")
  private pseudo: string;

  @type("string")
  private action: string;

  @type("number")
  private timestamp: number;

  @type(Location)
  private location: Location;

  @type("string")
  private pseudoStealed?: string;

  private chaseObjectLocation: number[];

  getAction() {
    return this.action;
  }

  getStatus() {
    return this.status;
  }

  getPseudo() {
    return this.pseudo;
  }

  getLocation() {
    return this.location.getLocation();
  }

  getTimestamp() {
    return this.timestamp;
  }

  getChaseObjectLocation() {
    return this.chaseObjectLocation;
  }
}
