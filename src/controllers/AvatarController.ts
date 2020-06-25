import {IAvatar, getAvatars} from "../models/avatar";
import { Request, Response } from "express";

export class AvatarController {
  public async getAvatars(req: Request, res: Response) {
    try {
      const avatars = await getAvatars()
      res.status(200).send(avatars);
    }
    catch(err) {
      console.log('error', err);
      res.status(501).send(err);
    }
  }
}
