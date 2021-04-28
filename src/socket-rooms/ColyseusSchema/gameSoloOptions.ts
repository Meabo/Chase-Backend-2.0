import {Schema, type, ArraySchema} from "@colyseus/schema";
import ChaseObject from "./ChaseObject";
import {Location} from "./Location";

export default class GameSoloOptions extends Schema {
    @type(ChaseObject)
    chaseObjectLocation: ChaseObject;
  
    @type("number")
    time: number;

    @type([Location])
    bounds = new ArraySchema<Location>();
}