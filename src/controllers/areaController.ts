import * as mongoose from "mongoose";
import {findAllAreas, findAreaById} from "../models/areas";
import {Request, Response} from "express";

export class AreaController {
  public async getAreas(req: Request, res: Response) {
    const {lat, lng, limit} = req.query;
    findAllAreas(lat, lng, limit)
      .then((areas) => {
        res.status(200).send(areas);
      })
      .catch((error) => res.status(501).send(error));
  }

  public async getAreaWithId(req: Request, res: Response) {
    findAreaById(req.params.id)
      .then((area) => res.status(200).send(area))
      .catch((error) => res.status(501).send(error));
  }
}
