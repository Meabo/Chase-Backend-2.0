import {Schema, type, ArraySchema} from "@colyseus/schema";
import ChaseObject from "./chaseobject";
import {Location} from "./location";

export default class GameSoloOptions extends Schema {
    @type(ChaseObject)
    chaseObjectLocation: ChaseObject;
  
    @type("number")
    time: number;

    @type([Location])
    bounds = new ArraySchema<Location>();
}