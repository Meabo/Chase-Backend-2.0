import mongoose, { Schema, Document } from 'mongoose';
import {findAllusers, findUserById, findUserBy, findOrCreate} from "../models/user";
import { Request, Response } from "express";
import axios from "axios"

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
    return await findOrCreate(response.data)
  }
}
