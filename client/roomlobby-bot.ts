// script.ts
import { Room, Client } from "colyseus.js";
import shortid = require("shortid")

export function requestJoinOptions (this: Client, i: number) {
    return {
    playerId: shortid.generate(), test: true,
    pseudo: `Client ${i}`, avatarUrl: `https://www.getchase.net/images/avatar${i%11 + 1}.png` };
}

export function onJoin(this: Room) {
    console.log(this.sessionId, "joined.");

    this.onMessage("*", (type, message) => {
        console.log("onMessage:", type, message);
    });
}

export function onLeave(this: Room) {
    console.log(this.sessionId, "left.");
}

export function onError(this: Room, err) {
    console.error(this.sessionId, "!! ERROR !!", err.message);
}

export function onStateChange(this: Room, state) {
}