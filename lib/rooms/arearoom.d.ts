import { Room, Client } from "colyseus";
import { Schema, ArraySchema } from "@colyseus/schema";
import Area from "../area";
import History from "../history";
declare class State extends Schema {
    history: ArraySchema<History>;
    area: Area;
    constructor(area: Area);
}
export default class AreaRoom extends Room<State> {
    onInit(options: any): void;
    requestJoin(options: any, isNew: boolean): boolean;
    onJoin(client: Client, options: any, auth: any): void;
    onMessage(client: Client, data: any): void;
    onLeave(client: Client, consented: boolean): Promise<void>;
    onDispose(): void;
}
export {};
