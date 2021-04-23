import * as Colyseus from "colyseus.js"; // not necessary if included via <script> tag.

const client = new Colyseus.Client('ws://localhost:4000');

client.joinOrCreate("lobby-5ed6a5df31c7d81f5792fb83", {}).then(room => {
    console.log(room.sessionId, "joined", room.name);
}).catch(e => {
    console.log("JOIN ERROR", e);
});