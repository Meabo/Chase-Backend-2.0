import {IGame, getGamesWithGeolocationFilterFromDb, getGameById} from "../models/game";
import { Request, Response } from "express";

export class GameController {
  public async getGamesWithGeolocationFilter(req: Request, res: Response) {
    const lat = req.query["lat"];
    const lon = req.query["lon"];
    const distance = req.query["distance"];
    const limit = req.query["limit"];

    console.log('lat and lon', lat, lon)

    try {
      const games = await getGamesWithGeolocationFilterFromDb(lat, lon, distance, limit)
      res.status(200).send(games);
    }
    catch(err) {
      console.log('error', err);
      res.status(501).send(err);
    }
  }

  public async getGameById(req: Request, res: Response) {
    const gameId = req.params["gameId"]
    try {
      const games = await getGameById(gameId)
      res.status(200).send(games);
    }
    catch(err) {
      console.log('error', err);
      res.status(501).send(err);
    }
  }
}
