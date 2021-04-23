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
  /*
    constructor(id: string, pseudo: string, avatarUrl: string) {
      super();
      this.id = id;
      this.pseudo = pseudo;
      this.avatarUrl = avatarUrl;
      this.is_ready = false;
    }
    
    isReady() {
      return this.is_ready;
    }
  
    setReady(ready: boolean) {
      this.is_ready = ready;
    }
  
    getId() {
      return this.id;
    }*/
  }
  