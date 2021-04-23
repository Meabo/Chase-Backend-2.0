import { Schema, type, ArraySchema, MapSchema } from "@colyseus/schema";
import { Message } from "./Message";
import { PlayerLobby } from "./PlayerLobby";

export class GameLobbySchema extends Schema {
  @type("string")
  name: String;

  @type([Message])
  history: ArraySchema<Message> = new ArraySchema<Message>();

  @type({ map: PlayerLobby })
  players: MapSchema<PlayerLobby> = new MapSchema<PlayerLobby>();

  @type("string")
  creator_name: String;

  @type("int16")
  counter: number = 0;

  @type("string")
  gameId: String;
}
