import {GameSchema} from "../ColyseusSchema/GameSchema"
import Player from "../ColyseusSchema/PlayerGame";
import {Location} from "../ColyseusSchema/Location";
import ChaseObject from "../ColyseusSchema/ChaseObject";
import { getGameById, IGame } from "../../models/game";
import Area from "../ColyseusSchema/Area";
import {
  distance,
  distanceByLoc,
  calcRandomPointInTriangle,
  robustPointInPolygon,
} from "../../utils/locationutils";
import { Command } from "@colyseus/command";
import { Constants } from "../../utils/constants";
import {UserLocation} from "../ColyseusSchema/Userlocation"
import SchemaConverter from "../../utils/colyseusUtils"
import {GameParameters} from "../Parameters/GameParameters"


export class ChaseObjectMoveCommand extends Command<GameSchema> {
    generatePositionForChaseObject() {
      const triangles = this.state.area.getTriangles();
      const { latitude, longitude } = calcRandomPointInTriangle(triangles);
      this.state.chaseObject = new ChaseObject(latitude, longitude);
      console.log(
        "Finished ChaseObjectMoveCommand",
        this.state.chaseObject.toJSON()
      );
    }
  
    execute({ withGuardianReset }) {
      this.generatePositionForChaseObject();
      if (withGuardianReset) this.state.guardian = null;
    }
  }
  
  export class InitGameCommand extends Command<GameSchema> {
    // Validate fetch and gameId
  
    async execute({ fetch, gameId }) {
      if (fetch) {
        const game: IGame = await getGameById(gameId);
  
        this.state.gameId = game.id;
        this.state.area = new Area().assign({
          name: game.area.name,
          location: new Location().assign({lat: game.area.location.coordinates[0], lon: game.area.location.coordinates[1]}),
          bounds: SchemaConverter.ArrayToLocation(game.area.bounds.coordinates)
        });
  
        this.state.area.initBoundsArray()
  
        return [new ChaseObjectMoveCommand().setPayload(false)];
      }
    }
  }
  
  export class CreatePlayerCommand extends Command<GameSchema> {
    createPlayer(playerId: string, pseudo: string, lat: number, lon: number) {
      this.state.players.set(playerId, new Player().assign({pseudo, lat, lon}));
    }
  
    execute({ playerId, pseudo, lat, lon }) {
      console.log('Creating player', playerId, pseudo, lat, lon)
      this.createPlayer(playerId, pseudo, lat, lon);
    }
  }
  
  export class RemovePlayerCommand extends Command<GameSchema> {
    deletePlayer(playerId: string) {
      this.state.players.delete(playerId);
    }
  
    execute({ playerId }) {
      this.deletePlayer(playerId);
    }
  }
  
  export class CatchChaseObjectCommand extends Command<GameSchema> {
    catchChaseObject(playerId: string) {
      const player = this.state.players.get(playerId)
      console.log('Player Catch', player.toJSON())
      const lat = player.lat;
      const lon = player.lon;
      const pseudo = player.pseudo;
      let result = false;

      if (!this.state.isAlreadyGuardian()) {
        const distance = distanceByLoc(
          [lat, lon],
          this.state.chaseObject.getLocation()
        );
        if (distance < GameParameters.distanceToCatch) {
            console.log(`${pseudo} is the new Guardian`)
          // in meters
          this.state.guardian = new Player().assign({pseudo, lat, lon})
          this.state.chaseObject = null; // Reset ChaseObject location
          this.state.players.get(playerId).score += GameParameters.scoreCatch;
          result = true;
        } else {
          console.log(
            "Catch did not happen, too far",
            "distance is too far: " + distance
          );
          result = false;
        }
        return [new HistoryAddActionCommand().setPayload({
          playerId,
          result,
          action: Constants.Actions.Catch,
          pseudo,
          lat,
          lon,
        })]
      }
    }
  
    execute({ playerId }) {
      this.catchChaseObject(playerId);
    }
  }
  
  class HistoryAddActionCommand extends Command<GameSchema> {
    // Validate before executing
  
    execute({ playerId, action, result, pseudo, lat, lon, pseudoStealed }) {
      this.state.history.addAction(this.state.gameId, playerId, action, {
        status: result ? Constants.Success : Constants.Failure,
        pseudo,
        pseudoStealed,
        location: [lat, lon],
        timestamp: new Date().getTime(),
      });
    }
  }
  
  export class StealChaseObjectCommand extends Command<GameSchema> {
    // Validate before executing
    stealChaseObject(playerId: string) {
      let result = false;
      const { pseudo, lat, lon } = this.state.players[playerId];
      if (!this.state.guardian || pseudo === this.state.guardian.pseudo) return;
      const { pseudo: guardianPseudo } = this.state.guardian;
      const distance = distanceByLoc(
        this.state.players.get(playerId).getLocation(),
        this.state.guardian.getLocation()
      );
      if (distance < GameParameters.distanceToSteal) {
        this.state.guardian = new Player().assign({pseudo, lat, lon})
        console.log(`${pseudo} is the new Guardian`)
        result = true;
        this.state.players.get(playerId).score += GameParameters.scoreSteal;
      }
  
      new HistoryAddActionCommand().setPayload({
        playerId,
        action: Constants.Actions.Steal,
        result,
        pseudo,
        lat,
        lon,
        pseudoStealed: guardianPseudo,
      });
      return result;
    }
    execute({ playerId }) {
      this.stealChaseObject(playerId);
    }
  }
  
  export class MoveCommand extends Command<GameSchema> {
    movePlayer(playerId: string, userLocation: UserLocation) {
      try {
        const lat = this.state.players.get(playerId).lat
        const lon = this.state.players.get(playerId).lon
        console.log('Player', this.state.players.get(playerId).toJSON())
        const { lat: newlat, lon: newlon, speed } = userLocation;
        console.log('Payload', userLocation)
  
        if (lat && lon && newlat && newlon) {
          const distanceTraveled = distance(lat, lon, newlat, newlon) / 1000;
          this.state.players.get(playerId).lat = newlat;
          this.state.players.get(playerId).lon = newlon;
          this.state.players.get(playerId).distance += distanceTraveled;
          this.state.players.get(playerId).score += distanceTraveled / 10;
          this.state.history.addMove(
            this.state.gameId,
            playerId,
            [lat, lon],
            [newlat, newlon],
            new Date().getTime(),
            speed
          );
        }
    
        if (
          this.state.isAlreadyGuardian() &&
          this.state.players.get(playerId).pseudo === this.state.guardian.pseudo
        ) {
          this.state.guardian.lat = newlat;
          this.state.guardian.lon = newlon;
        }
        if (
          this.state.isAlreadyGuardian() &&
          this.state.players.get(playerId).pseudo === this.state.guardian.pseudo &&
          !this.state.area.isInside([newlat, newlon])
        ) {
         // Add this once going real:
         // return [new ChaseObjectMoveCommand().setPayload({withGuardianReset: true})];
        }
      }
      catch (err) {
        console.error(err);
      }
    }
  
    execute({ playerId, position }) {
      return this.movePlayer(playerId, position);
    }
  }
  