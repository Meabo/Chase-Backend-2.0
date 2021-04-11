import {Schema, type} from "@colyseus/schema";

export default class Player extends Schema {
  @type("string")
  pseudo: string;

  @type("number")
  lat: number;

  @type("number")
  lon: number;
  
  @type("number")
  score: number = 0;

  @type("number")
  distance: number = 0;

  playerId: string = "";

  constructor(pseudo_: string, lat: number, lon: number) {
    super();
    this.pseudo = pseudo_;
    this.lat = lat;
    this.lon = lon;
  }

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
