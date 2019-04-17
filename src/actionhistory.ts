import {Schema, type, ArraySchema} from "@colyseus/schema";
import {Location} from "../src/location";

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

  constructor(gameId: string, playerId: string, action: string, payload: any) {
    super();
    const {status, pseudo, pseudoStealed, location, timestamp} = payload;
    this.gameId = gameId;
    this.playerId = playerId;
    this.status = status;
    this.pseudo = pseudo;
    this.action = action;
    this.location = new Location(location[0], location[1]);
    this.timestamp = timestamp;
    if (action === "steal") this.pseudoStealed = pseudoStealed;
  }
}
