import {Schema, type} from "@colyseus/schema";

export default class Player extends Schema {
  @type("string")
  pseudo: string;

  @type("float64")
  lat: number;

  @type("float64")
  lon: number;
  
  @type("uint32")
  score: number = 0;

  @type("float32")
  distance: number = 0.0;

  @type("string")
  playerId: string;

  getPseudo() {
    return this.pseudo;
  }

  getLocation() {
    return [this.lat, this.lon];
  }

  getPlayerId() {
    return this.playerId;
  }
}
