import { Room, Client } from "colyseus";
import { methods } from "../../../servers/socketServer";
import http from "http";
import { IUser, fetchUserInDatabase, Users } from "../../models/user";
import { GameLobbySchema } from "../ColyseusSchema/GameLobbySchema";
import { PlayerLobby } from "../ColyseusSchema/PlayerLobby";
import { Message } from "../ColyseusSchema/Message";
import shortid from "shortid";

export class GameLobby extends Room<GameLobbySchema> {
  // When room is initialized

  onCreate(options: any) {
    const state = new GameLobbySchema();
    this.setState(state);
    this.setSeatReservationTime(50);

    this.onMessage("*", (client, message) => {
      console.log(`${client.id} sent a message : ${message}`);
    });

    this.onMessage("ready", (client) => {
      try {
        const currentPlayer: PlayerLobby = this.state.players.get(client.id);
        currentPlayer.is_ready = !currentPlayer.is_ready;
        currentPlayer.is_ready ? this.state.counter++ : this.state.counter--;
        const numberOfPlayers = this.state.players.size;
        const numberOfPlayersThatAreReady = this.state.counter;
        const creatorPseudo = this.state.creator_name;
        const creatorPlayer: PlayerLobby = Array.from(
          this.state.players.values()
        ).find((player: PlayerLobby) => player.pseudo == creatorPseudo);
        const creatorClient: Client = this.clients.find(
          (client: Client) => client.id === creatorPlayer.id
        );
        const action =
          numberOfPlayers - 1 === numberOfPlayersThatAreReady
            ? "everyone_ready"
            : "everyone_not_ready";
        if (creatorClient) {
          creatorClient.send(action);
          console.log("sent to Room Creator", action);
        }
      } catch (err) {
        console.error(err);
      }
    });

    this.onMessage("leave", (client, message) => {
      this.onLeave(client, true);
    });

    this.onMessage("start", (client, message) => {
      /*methods
        .createGame({ name: this.state.gameId })
        .then((id) => {
          this.broadcast("gameRoom", this.state.gameId);
        })
        .catch((err) => {
          this.broadcast("gameRoom", null);
        });*/
    });
  }

  addPlayerToList(client: Client, user: IUser) {
    const playerlobby = new PlayerLobby();
    playerlobby.id = user.id;
    playerlobby.pseudo = user.pseudo;
    playerlobby.avatarUrl = user.avatarUrl;
    this.state.players.set(client.id, playerlobby);
    if (this.state.players.size === 1) {
      this.state.creator_name = playerlobby.pseudo;
    }
    return playerlobby;
  }

  saveHistory(client: Client) {
    const message = new Message();
    message.text = `${client.id} joined GameLobby.`;
    message.sender = "server";
    this.state.history.push(message);
  }

  onJoinForTesting(client: Client, options: any) {
    client.id = options.playerId;
    this.addPlayerToList(
      client,
      new Users({
        id: options.playerId,
        pseudo: options.pseudo,
        avatarUrl: options.avatarUrl,
      })
    );
    this.saveHistory(client);
  }

  // When client successfully join the room
  async onJoin(client: Client, options: any, auth: any) {
    if (options && options.test) this.onJoinForTesting(client, options);
    else {
      if (!options || !options.playerId)
        throw "Error, no id has been registered";
      try {
        client.id = options.playerId;
        const playerFetchedFromDb = await fetchUserInDatabase(client.id);
        const playerInLobby: PlayerLobby = this.addPlayerToList(
          client,
          playerFetchedFromDb
        );
        this.saveHistory(client);
        console.log("onJoined", playerInLobby.pseudo);
      } catch (err) {
        console.log("error during onJoin", err);
        throw err;
      }
    }
  }
  everyoneIsReady(clients, playersReady): boolean {
    return clients.length === playersReady.length;
  }

  onAuth(client: Client, options: any, request: http.IncomingMessage) {
    return true;
  }

  onLeave(client: Client, consented: boolean) {
    const message = new Message();
    message.text = `${client.id} left GameLobby.`;
    message.sender = "server";
    this.state.history.push(message);
    const playerToDelete = this.state.players.get(client.id);
    if (playerToDelete) {
      this.state.players.delete(client.id);
      if (playerToDelete.pseudo === this.state.creator_name) {
        const newCreatorPlayer = this.state.players.values().next()
          .value as PlayerLobby;
        this.state.creator_name = newCreatorPlayer.pseudo;
      }
    }
    console.log("onLeave(" + client.id + ")", consented);
  }

  onDispose() {
    console.log("Disposed Room");
  }
}
