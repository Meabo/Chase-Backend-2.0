import {Schema, type, ArraySchema, MapSchema} from "@colyseus/schema";

export class PlayerLobby extends Schema {
    @type("string")
    id: string
  
    @type("string")
    pseudo: string
  
    @type("boolean")
    is_ready: boolean;
  
    @type("string")
    avatarUrl: string;
  }
  