import { Room, Client } from "colyseus";
import Game from "../game";
export default class GameInstance extends Room<Game> {
    onInit(options: any): void;
    requestJoin(options: any, isNew: boolean): boolean;
    onJoin(client: Client, options: any, auth: any): void;
    onMessage(client: Client, data: any): Promise<void>;
    onLeave(client: Client, consented: boolean): void;
    onDispose(): void;
}
