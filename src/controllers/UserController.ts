import mongoose, { Schema, Document } from 'mongoose';
import {findAllusers, findUserById, findUserBy, findOrCreateByFacebookProfile, createPlayerInDb} from "../models/user";
import { Request, Response } from "express";
import axios from "axios"
import { verifyAccessToken } from "../authentication/token";

export class UserController {
  public getUsers(req: Request, res: Response) {
    findAllusers()
      .then((users) => {
        console.log("Users", users);
        res.status(200).send(users);
      })
      .catch((error) => res.status(501).send(error));
  }

  public async findUserById(id: string) {
    findUserById(id)
      .then((user) => user)
      .catch((error) => error);
  }

  public async findUser(parameter: string, value: any) {
    findUserBy(parameter, value)
      .then((user) => user)
      .catch((error) => error);
  }

  public async createUserFacebook(id: string, facebookAccessToken: string) {
    const fields = "id,first_name,last_name,email,age_range,gender,birthday,name_format"
    const graphUrl = `https://graph.facebook.com/v6.0/me?fields=${fields}&access_token=${facebookAccessToken}`
    
    const response = await axios.get(graphUrl);
    return await findOrCreateByFacebookProfile(response.data)
  }

  public async createPlayer(req: Request, res: Response) {
    //Todo: require pseudo and avatarUrl not null
    console.log('CreatePlayer Pseudo', req.query.pseudo);
    try {
      const queryToken = req.query["accessToken"] as string;
      const decodedToken = await verifyAccessToken(queryToken)
      const userId = decodedToken.sub;
      console.log("decodedToken", decodedToken);
      await createPlayerInDb(userId, (req.query.pseudo as string), (req.query.avatar_url as string));
      res.status(200).send({success: true, pseudo: req.query.pseudo, avatar_url: req.query.avatar_url});
    } catch (err) {
          // Todo: Log Error as Kazmon do (need research)
          console.log("Error while updating", err);
          res.status(404).send({success: false, error: err} );
    }
  }
}
