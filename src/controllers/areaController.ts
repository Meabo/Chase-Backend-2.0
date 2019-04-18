import * as mongoose from "mongoose";
import {AreaSchema} from "../models/areas";
import {Request, Response} from "express";

const Areas = mongoose.model("Areas", AreaSchema);

export class AreaController {
  public addNewArea(req: Request, res: Response) {
    let newContact = new Areas(req.body);
    newContact.save((err, contact) => {
      if (err) {
        res.send(err);
      }
      res.json(contact);
    });
  }

  public getAreas(req: Request, res: Response) {
    Areas.find({}, (err, contact) => {
      if (err) {
        res.send(err);
      }
      res.json(contact);
    });
  }

  public getAreaWithId(req: Request, res: Response) {
    Areas.findById(req.params.contactId, (err, contact) => {
      if (err) {
        res.send(err);
      }
      res.json(contact);
    });
  }

  public updateArea(req: Request, res: Response) {
    Areas.findOneAndUpdate(
      {_id: req.params.contactId},
      req.body,
      {new: true},
      (err, area) => {
        if (err) {
          res.send(err);
        }
        res.json(area);
      }
    );
  }

  public deleteArea(req: Request, res: Response) {
    Areas.remove({_id: req.params.contactId}, (err, contact) => {
      if (err) {
        res.send(err);
      }
      res.json({message: "Successfully deleted contact!"});
    });
  }
}
