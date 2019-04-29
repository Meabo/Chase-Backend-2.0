import {Request, Response, NextFunction} from "express";
import {AreaController} from "../controllers/areaController";
import {PersonController} from "../controllers/personController";

export class Routes {
  public areaController: AreaController = new AreaController();
  public personController: PersonController = new PersonController();

  public routes(app): void {
    app.route("/").get((req: Request, res: Response) => {
      res.status(200).send({
        message: "Welcome to Chase"
      });
    });

    app
      .route("/areas")
      .get((req: Request, res: Response, next: NextFunction) => {
        // middleware
        console.log(`Request from: ${req.originalUrl}`);
        console.log(`Request type: ${req.method}`);
        next();
      }, this.areaController.getAreas);

    app
      .route("/areas/:areaId")
      // get specific contact
      .get(this.areaController.getAreaWithId);

    app.route("/person").get(this.personController.getPersons);
  }
}
