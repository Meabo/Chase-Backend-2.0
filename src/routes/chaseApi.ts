import {Request, Response, NextFunction} from "express";
import {AreaController} from "../controllers/areaController";

export class Routes {
  public areaController: AreaController = new AreaController();

  public routes(app): void {
    app.route("/").get((req: Request, res: Response) => {
      res.status(200).send({
        message: "Welcome to Chase"
      });
    });

    // Contact
    app
      .route("/area")
      .get((req: Request, res: Response, next: NextFunction) => {
        // middleware
        console.log(`Request from: ${req.originalUrl}`);
        console.log(`Request type: ${req.method}`);
        next();
      }, this.areaController.getAreas)

      // POST endpoint
      .post(this.areaController.addNewArea);

    // Contact detail
    app
      .route("/contact/:contactId")
      // get specific contact
      .get(this.areaController.getAreaWithId)
      .put(this.areaController.updateArea)
      .delete(this.areaController.deleteArea);
  }
}
