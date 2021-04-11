import express from "express";
import bodyParser from "body-parser";
import { Routes } from "../src/routes/routes";
import mongoose from "mongoose";
import { passportMethods } from "../src/authentication/passportStrategies"
import path from "path"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import expressSession from "express-session"
import {Games} from "../src/models/game"
import {methods} from "./socketServer"
import { monitor } from "@colyseus/monitor";
import basicAuth from "express-basic-auth";


class Server {
  public app: express.Application = express();
  public routePrv: Routes = new Routes();
  public mongoUrl: string = `mongodb+srv://${process.env.MONGODB_CLIENT}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DATABASE}`;

  constructor() {
    this.config();
    this.mongoSetup();
    this.routePrv.routes(this.app);
  }

  private config(): void {
    this.configApplicationMiddleWare()
    this.configViews()
    this.configPassport()
    this.configColyseusMonitor();
  }

  private configApplicationMiddleWare(): void {
    this.app.use(morgan("dev"));
    this.app.use(cookieParser())
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(express.static('public'))

    this.app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
  }

  private configViews(): void {
    this.app.set("views", path.join(__dirname + "/../src/views"));
    this.app.set("view engine", "ejs");
  }

  private configPassport(): void {
    this.app.use(passportMethods.init());
    this.app.use(passportMethods.initSession());
  }

  private configColyseusMonitor(): void {
    const basicAuthMiddleware = basicAuth({
      // list of users and passwords
      users: {
          "admin": "admin",
      },
      // sends WWW-Authenticate header, which will prompt the user to fill
      // credentials in
      challenge: true
  });
    this.app.use("/colyseus", monitor());

  }

  private async createLobbyGameRooms() {
    const games = mongoose.connection.db.collection("Games")
    const fetchedGames = await Games.find().exec();
    fetchedGames.map(async game => {
      methods.createGameLobby({name: `lobby-${game.id}`, gameId: game.id});
      await methods.createGame({name: game.id, gameId: game.id});
      console.log(`lobby-${game.id}`);
    })
  }

  private mongoSetup(): void {
    mongoose
      .connect(this.mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(async () => {
       console.log("MongoDB connected…");
       await this.createLobbyGameRooms();
      })
      .catch(err => console.log("Error", err));
  }
}

export default new Server().app;
