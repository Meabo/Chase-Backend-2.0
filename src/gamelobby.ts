import {Schema, type, ArraySchema, MapSchema} from "@colyseus/schema";
import {Users} from "./models/user"
import shortid from "shortid"

export class PlayerLobby extends Schema {
  @type("string")
  id: string

  @type("string")
  pseudo: string

  @type("boolean")
  is_ready = false;

  @type("string")
  avatarUrl: string;

  constructor(id: string, pseudo: string, avatarUrl: string) {
    super();
    this.id = id;
    this.pseudo = pseudo;
    this.avatarUrl = avatarUrl;
  }

  getId() {
    return this.id;
  }
}

export class Message extends Schema {
  @type("string")
  id: string = shortid.generate();

  @type("string")
  text: string;

  @type("string")
  sender: string;

  @type("int64")
  time: number = Date.now();
}

export class GameLobbySchema extends Schema {

    @type("string")
    name: String;

    private gameId: String;

    @type([Message])
    history = new ArraySchema<Message>();
  
    @type({map: PlayerLobby})
    players = new MapSchema<PlayerLobby>();

    @type("string")
    creator_name: String;
  
    @type("int16")
    counter: number = 0;

    constructor(options) {
      super();
      this.name = options.name;
      this.gameId = options.gameId;
    }

    async fetchUserInDatabase(userId: string) {
      try {
        return await Users.findById(userId)
      } catch (err) {
        throw err;
      }
    }

    getGameId() {
      return this.gameId;
    }
}

