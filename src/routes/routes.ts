import express from "express";
import passport from "passport"
import connectEnsureLogin from "connect-ensure-login"

import { Request, Response, NextFunction } from "express";
import { AreaController } from "../controllers/areaController";
import { UserController } from "../controllers/UserController";
import "../authentication/passportStrategies"

export class Routes {
  public areaController: AreaController = new AreaController();
  public userController: UserController = new UserController();

  private generateAuthenticationRoutes(app: express.Application) {
    app.get("/login", (req, res) => { res.render("login")});
    app.get("/login/facebook", passport.authenticate("facebook"));

    app.get("/return", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
      res.redirect('/');
    });

    app.get("/profile", (req, res) => { connectEnsureLogin.ensureLoggedIn(), res.render("profile", { user: req.user })});
  }

  private generateGameRoutes(app: express.Application) {
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

  public routes(app: express.Application): void {
    app.get('/', (req: Request, res: Response) => {
      res.render("home", { user: req.user });
    });

    this.generateAuthenticationRoutes(app);
    this.generateGameRoutes(app);
  }
}
