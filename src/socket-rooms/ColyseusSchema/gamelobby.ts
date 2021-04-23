import {Schema, type, ArraySchema, MapSchema} from "@colyseus/schema";
import {Users} from "../../models/user"
import shortid from "shortid"

export class PlayerLobby extends Schema {
  @type("string")
  id: string

  @type("string")
  pseudo: string

  @type("boolean")
  is_ready: boolean;

  @type("string")
  avatarUrl: string;

/* constructor(id: string, pseudo: string, avatarUrl: string) {
    super();
    this.id = id;
    this.pseudo = pseudo;
    this.avatarUrl = avatarUrl;
    this.is_ready = false;
  }*/
  
 /* isReady() {
    return this.is_ready;
  }

  setReady(ready: boolean) {
    this.is_ready = ready;
  }

  getId() {
    return this.id;
  }*/
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