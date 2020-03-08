import mongoose, { Schema, Document } from 'mongoose';
import {findAllusers, findUserById} from "../models/user";
import {Request, Response} from "express";

export class UserController {

  public getUsers(req: Request, res: Response) {
    findAllusers()
      .then((users) => {
        console.log("Users", users);
        res.status(200).send(users);
      })
      .catch((error) => res.status(501).send(error));
  }

  public async getUserById(req: Request, res: Response) {
    findUserById(req.params.id)
      .then((user) => res.status(200).send(user))
      .catch((error) => res.status(501).send(error));
  }
}
