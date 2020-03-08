import { Room, Client } from "colyseus";
import { Schema, ArraySchema } from "@colyseus/schema";
import Area from "../area";
import History from "../history";
declare class State extends Schema {
    history: ArraySchema<History>;
    areas: ArraySchema<Area>;
    constructor(areas: Area[]);
}
export default class Discovery extends Room<State> {
    onInit(options: any): void;
    onAuth(options: any): Promise<{
        success: boolean;
    }>;
    requestJoin(options: any, isNew: boolean): boolean;
    onJoin(client: Client, options: any, auth: any): void;
    onMessage(client: Client, data: any): void;
    onLeave(client: Client, consented: boolean): Promise<void>;
    onDispose(): void;
}
export {};
