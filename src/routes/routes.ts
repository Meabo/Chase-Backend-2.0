import express from "express";
import passport from "passport"

import { Request, Response, NextFunction } from "express";
import { AreaController } from "../controllers/areaController";
import { UserController } from "../controllers/UserController";
import { passportMethods } from "../authentication/passportStrategies"
import { verifyFacebookToken, verifyAccessToken } from "../authentication/token";

export class Routes {
  public areaController: AreaController = new AreaController();
  public userController: UserController = new UserController();

  constructor() {
    this.initConfig();
  }
  
  public routes(app: express.Application): void {
    app.get('/', (req, res) => {
      res.render("home", { user: req.user });
    });

    this.generateWebAuthenticationRoutes(app);
    this.generateGameRoutes(app);
    this.generateAndroidAuthenticationRoutes(app);
    this.generateOnboardingRoutes(app);
  }

  private initConfig() {
    passportMethods.initStrategies();
  }

  private generateWebAuthenticationRoutes(app: express.Application) {
    
    /* TESTING PURPOSES */
    app.get("/login", (req, res) => { res.render("login")});
    app.get("/login/web/facebook", passport.authenticate("facebook"));
    app.get("/return", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
      res.redirect('/');
    });
    app.get("/profile", (req, res) => { res.render("profile", { user: req.user})});
    /* END OF TESTING PURPOSES */
  }

  private generateAndroidAuthenticationRoutes(app: express.Application) {
    
    app
    .route("/login/android/facebook")
    .get((req, res, next) => {
      passport.authenticate("customAndroidFacebookStrategy", (err, token) => {
        if (err) 
          res.status(500).send(err);
        else {
          res.status(200).send({accessToken: token});
        }
      })(req, res, next)
    });
  }

  private generateOnboardingRoutes(app: express.Application) {
    app
    .route("/onboarding/player/create")
    .post((req: Request, res, next) => {
      console.log('Onboarding Request', req.query)
      next();
    }, this.userController.createPlayer)
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
    app.route("/users/:userId").get();
  }
}
