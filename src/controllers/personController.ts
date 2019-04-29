import * as mongoose from "mongoose";
import {findAllPersons} from "../models/person";
import {Request, Response} from "express";

export class PersonController {
  public getPersons(req: Request, res: Response) {
    findAllPersons()
      .then((persons) => {
        console.log("Persons", persons);
        res.status(200).send(persons);
      })
      .catch((error) => res.status(501).send(error));
  }
}
