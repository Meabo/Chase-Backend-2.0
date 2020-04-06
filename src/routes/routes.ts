import express from "express";
import passport from "passport"
import axios from "axios"

import { Request, Response, NextFunction } from "express";
import { AreaController } from "../controllers/areaController";
import { UserController } from "../controllers/UserController";
import { passportMethods } from "../authentication/passportStrategies"
import { generateAccessToken } from "../authentication/token"

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
    .get((req: any, res: Response, next: NextFunction) => {
        const facebookAccessToken = req.query.accessToken
        if (!facebookAccessToken)
          res.status(400).send('Facebook Token has not been set or is invalid')
        else {
          const graphUrl = `https://graph.facebook.com/v6.0/debug_token?input_token=${facebookAccessToken} 
          &access_token=${process.env.FACEBOOK_ID}|${process.env.FACEBOOK_SECRET}`
          axios.get(graphUrl)
          .then((response) => {
           // console.log("response", response)
            if (response.data.data.is_valid)
              {
                const data = response.data.data;
                this.userController.findUser("profile_facebook_id", data.user_id)
                .then((user: any) => {
                   let user_ = user;
                   if (!user) { 
                     user_ = this.userController.createUserFacebook(data.user_id, facebookAccessToken); 
                    }
                    user_.id = data.user_id;
                    const token = generateAccessToken(user_.id);
                    console.log('Json Web token sent', token)
                    res.status(200).send({success: true, token})
                })
              }
              else {
                res.status(500).send(response.data.error.message);
              }
          })
       
        }
        
    });
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
