import server from "./servers/server";
import {gameServer, methods} from "./servers/socketServer";

const PORT = 3000;
const SOCKET_PORT = 4000;

server.listen(PORT, () => {
  console.log("Express server listening on port " + PORT);
});

gameServer.listen(SOCKET_PORT, "", 0, () => {
  console.log("Socket server listening on port " + SOCKET_PORT);
  testingPurpose();
});

function testingPurpose() {
  methods.createSoloGame("solo", {
    chaseObjectLoc: [48.8556475, 2.2986304],
    gameId: "sologame0",
    arealoc: [48.8556475, 2.2986304],
    bounds: [
      [48.8569443, 2.2940138],
      [48.8586221, 2.2963717],
      [48.8523546, 2.3012814],
      [48.8539637, 2.3035665]
    ]
  });
}
