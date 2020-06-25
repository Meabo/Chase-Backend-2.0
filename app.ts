import server from "./servers/server";
import {gameServer, methods} from "./servers/socketServer";

const PORT = 3000;
const SOCKET_PORT = 4000;

server.listen(PORT, () => {
  console.log("Express server listening on port " + PORT);
});

gameServer.listen(SOCKET_PORT, "", 0, () => {
  console.log("Socket server listening on port " + SOCKET_PORT);
})