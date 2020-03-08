import { Room, Client } from "colyseus";
export default class GameLobby extends Room {
    onInit(options: any): void;
    requestJoin(options: any, isNew: boolean): boolean;
    everyoneIsReady(clients: any, playersReady: any): boolean;
    onJoin(client: Client, options: any, auth: any): void;
    onMessage(client: Client, data: any): void;
    onLeave(client: Client, consented: boolean): void;
    onDispose(): void;
}
