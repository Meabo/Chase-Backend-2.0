import { Room, Client } from "colyseus";
import { Dispatcher } from "@colyseus/command";
import http from "http";
import { IUser, fetchUserInDatabase, Users } from "../../models/user";
import { GameLobbySchema } from "../ColyseusSchema/GameLobbySchema";
import { PlayerLobby } from "../ColyseusSchema/PlayerLobby";
import { Message } from "../ColyseusSchema/Message";
import { OnReadyLobbyCommand } from "../Commands/OnReadyLobbyCommand";

export class GameLobbyRoom extends Room<GameLobbySchema> {
  // When room is initialized
  dispatcher = new Dispatcher(this);

  onCreate(options: any) {
    const state = new GameLobbySchema().assign({
      name: options.name,
      gameId: options.gameId,
    });
    this.setState(state);
    this.setSeatReservationTime(50);
    this.onMessage("*", (client, message) => {
      console.log('Client sent', message)
    })

    this.onMessage("ready", (client) => {
      this.dispatcher.dispatch(new OnReadyLobbyCommand(), {
        id: client.id, clients: this.clients
      })
    });

    this.onMessage("leave", (client, message) => {
      this.onLeave(client, true);
    });

    this.onMessage("start", (client, message) => {
      try {
        this.broadcast("startGameRoom", this.state.gameId);
      } catch (err) {
        console.error(err);
      }
    });
  }

  addPlayerToList(client: Client, user: IUser) {
    const playerlobby = new PlayerLobby();
    playerlobby.id = user.id;
    playerlobby.pseudo = user.pseudo;
    playerlobby.avatarUrl = user.avatarUrl;
    if (this.state.players.size === 0) {
      this.state.creator_name = playerlobby.pseudo;
    }
    this.state.players.set(client.id, playerlobby);
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
    try {
      if (options && options.test) this.onJoinForTesting(client, options);
      else {
        if (!options || !options.playerId)
          throw "Error, no id has been registered";

        client.id = options.playerId;
        const playerFetchedFromDb = await fetchUserInDatabase(client.id);
        const playerInLobby: PlayerLobby = this.addPlayerToList(
          client,
          playerFetchedFromDb
        );
        this.saveHistory(client);
        console.log("onJoined", playerInLobby.pseudo);
      }
    } catch (err) {
      console.error("Error during onJoin", err);
    }
  }

  onAuth(client: Client, options: any, request: http.IncomingMessage) {
    return true;
  }

  onLeave(client: Client, consented: boolean) {
    try {
      const message = new Message();
      message.text = `${client.id} left GameLobby.`;
      message.sender = "server";
      this.state.history.push(message);
      const playerToDelete = this.state.players.get(client.id);
      if (playerToDelete) {
        this.state.players.delete(client.id);
        if (
          playerToDelete.pseudo === this.state.creator_name &&
          this.state.players.size >= 1
        ) {
          const newCreatorPlayer = this.state.players.values().next()
            .value as PlayerLobby;
          this.state.creator_name = newCreatorPlayer.pseudo;
          console.log('New Creator name', this.state.creator_name)
        }
      }
      console.log("onLeave(" + client.id + ")", consented);
    } catch (err) {
      console.error("Onleave", err);
    }
  }

  onDispose() {
    console.log("Disposed Room");
    this.dispatcher.stop();
  }
}
