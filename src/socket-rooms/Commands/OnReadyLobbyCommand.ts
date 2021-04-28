import { Client } from "colyseus";

import { Command } from "@colyseus/command";
import { GameLobbySchema } from "../ColyseusSchema/GameLobbySchema";

export class OnReadyLobbyCommand extends Command<
  GameLobbySchema,
  {
    id: string;
    clients: Client[];
  }
> {
  execute({ id, clients }) {
    const currentPlayer = this.state.players.get(id);
    currentPlayer.is_ready = !currentPlayer.is_ready;
    currentPlayer.is_ready ? this.state.counter++ : this.state.counter--;
    const numberOfPlayers = this.state.players.size;
    const numberOfPlayersThatAreReady = this.state.counter;
    const creatorPseudo = this.state.creator_name;
    const creatorPlayer = Array.from(this.state.players.values()).find(
      (player) => player.pseudo == creatorPseudo
    );
    const creatorClient: Client = clients.find(
      (client: Client) => client.id === creatorPlayer.id
    );
    const action =
      numberOfPlayers - 1 === numberOfPlayersThatAreReady
        ? "everyone_ready"
        : "everyone_not_ready";
    if (creatorClient) {
      creatorClient.send(action, "ready");
      console.log("sent to Room Creator", action);
    }
  }
}
