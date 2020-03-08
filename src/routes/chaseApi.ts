import express from "express";
import {Request, Response, NextFunction} from "express";
import {AreaController} from "../controllers/areaController";
import {UserController} from "../controllers/UserController";

export class Routes {
  public areaController: AreaController = new AreaController();
  public userController: UserController = new UserController();

  public routes(app: express.Application): void {
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

    app.route("/areas/:areaId").get(this.areaController.getAreaWithId);
    
    app.route("/users").get(this.userController.getUsers);
    app.route("/users/:userId").get(this.userController.getUserById);

  }
}
