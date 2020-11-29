import { Room, Client } from "colyseus";
import { eventBus } from "../utils/emitter/emitter";
import { PlayerLobby, Message, GameLobbySchema } from "../gamelobby";
import { methods } from "../../servers/socketServer";
import Player from "src/player";


export default class GameLobby extends Room<GameLobbySchema> {
  // When room is initialized

  onCreate(options: any) {
    console.log("RoomLobby created", options);
    this.setState(new GameLobbySchema(options));
  }

  // Checks if a new client is allowed to join. (default: `return true`)
  requestJoin(options: any, isNew: boolean) {
    return true;
  }

  everyoneIsReady(clients, playersReady): boolean {
    return clients.length === playersReady.length;
  }
  // Authorize client based on provided options before WebSocket handshake is complete
  /*onAuth(options) {
   */

  // When client successfully join the room
  onJoin(client: Client, options: any, auth) {
    client.id = options.playerId;
    this.state.fetchUserInDatabase(client.id).then((user) => 
    {
      this.addPlayerToList(client, user)
      this.state.creator_name = (this.state.players[Object.keys(this.state.players)[0]] as PlayerLobby).pseudo
      this.saveHistory(client);
    }).catch((err) => {
      if (err)
      throw ("Error, your Player is not registered");
    });
  }

  addPlayerToList(client, user) {
    const playerlooby = new PlayerLobby(user.id, user.pseudo, user.avatarUrl);
    this.state.players[client.id] = playerlooby;
  }

  saveHistory(client: Client) {
    const message = new Message();
    message.text = `${client.id} joined GameLobby.`;
    message.sender = "server";
    this.state.history.push(message);
  }

  // When a client sends a message
  onMessage(client: Client, data: any) {
    console.log(`${client.id} sent a message : ${data}`);
    if (data.action === "ready") {
      const currentPlayer: PlayerLobby = this.state.players[client.id];
      console.log('currentPlayer', JSON.stringify(this.state.players))
      currentPlayer.setReady(!currentPlayer.isReady());
      currentPlayer.isReady() ? this.state.counter++ : this.state.counter--;
      const numberOfPlayers = Object.keys(this.state.players).length;
      const numberOfPlayersThatAreReady = this.state.counter;      
      const creatorPseudo = this.state.creator_name
      const creatorPlayer : PlayerLobby = Object.values(this.state.players).find((player: PlayerLobby) => player.pseudo == creatorPseudo)
      const creatorClient: Client = this.clients.find((client: Client) => client.id === creatorPlayer.id)
      const action = numberOfPlayers - 1 === numberOfPlayersThatAreReady ? "everyone_ready" : "everyone_not_ready"
      try {
        if (creatorClient)
          this.send(creatorClient, {action});
      } catch (err) {
        throw err;
      }
    }
    if (data.action === "leave") {
      this.onLeave(client, true);
    }
    if (data.action === "start") {
       methods.createGame({name: this.state.getGameId()}).then((id) => {
        this.broadcast({action: "gameRoom", value: this.state.getGameId()})
       }).catch((err) => {
        this.broadcast({action: "gameRoom", value: null})
       })
    }
  }

  // When a client leaves the room
  onLeave(client: Client, consented: boolean) {
    const message = new Message();
    message.text = `${client.id} left GameLobby.`;
    message.sender = "server";
    this.state.history.push(message);
    console.log("Message: " + message.toString());
    delete this.state.players[client.id];
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {
    console.log("Disposed Room");
  }
}
