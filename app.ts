import { createServer } from "http";
import express from "express";
import { Server } from "colyseus";
import { GameLobbyRoom } from "./src/socket-rooms/Rooms/GameLobbyRoom";
import { GameInstance } from "./src/socket-rooms/Rooms/GameInstanceRoom";
import { Routes } from "./src/routes/routes";
import mongoose from "mongoose";
import { passportMethods } from "./src/authentication/passportStrategies";
import path from "path";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import { monitor } from "@colyseus/monitor";
import basicAuth from "express-basic-auth";
import cors from "cors";
import { Games } from "./src/models/game";
//import { methods } from "./servers/socketServer";

let gameServer: Server;
const PORT = 3000;
const SOCKET_PORT = 2567;

const initExpress = (app) => {
  app.use(express.json());
  app.use(cors());
  /* app.use(morgan("dev", {
    skip: function (req, res) {
      return req.url === "/colyseus"
    },
    stream: process.stderr
}));*/
  app.use(morgan("dev"));
  app.use(cookieParser());
  // app.use(express.urlencoded({extended: true})); //Parse URL-encoded bodies
  app.use(express.static("public"));

  app.use(
    expressSession({
      secret: "keyboard cat",
      resave: true,
      saveUninitialized: true,
    })
  );
};

const initGameServer = (app) => {
  gameServer = new Server({
    server: createServer(app),
  });
};

const initDefineRooms = async function () {
  try {
    const fetchedGames = await Games.find().exec();
    /*const gameLobbyHandler = gameServer
      .define(`gamelobby`, GameLobbyRoom, {
        name: `lobby-5ed6a5df31c7d81f5792fb83`,
        gameId: "5ed6a5df31c7d81f5792fb83",
      })
      .enableRealtimeListing();*/

    const gameHandler = gameServer
      .define(`game`, GameInstance, { gameId: "5ed6a5df31c7d81f5792fb83" })
      .enableRealtimeListing();

    /*fetchedGames.map((game) => {
      //const gameLobbyHandler = gameServer.define( `lobby-${game.id}`, GameLobbyRoom, { name: `lobby-${game.id}`, gameId: game.id });
      //console.log(`Created lobby-${game.id}`);
      const gameHandler = gameServer.define(game.id, GameInstance, { gameId: game.id });
      console.log(`Created Game ${game.id}`);

     
      // Define Game rooms here
      // Define other rooms
    });
    fetchedGames.map((game) => {
      const gameLobbyHandler = gameServer.define( `lobby-${game.id}`, GameLobbyRoom, { name: `lobby-${game.id}`, gameId: game.id });
      console.log(`Created lobby-${game.id}`);
      //const gameHandler = gameServer.define(game.id, GameInstance, { gameId: game.id });
      //console.log(`Created Game ${game.id}`);

     
      // Define Game rooms here
      // Define other rooms
    });*/
    console.log("finished define");
  } catch (err) {
    console.error(err);
  }
};

const listenServers = (app) => {
  app.listen(PORT, () => {
    console.log("Express server listening on port " + PORT);
  });

  gameServer.listen(SOCKET_PORT, null, null, () => {
    console.log("Colyseus listening on port " + SOCKET_PORT);
  });
};

const initViews = (app) => {
  try {
    app.set("views", path.join(__dirname + "/../src/views"));
    app.set("view engine", "ejs");
  } catch (err) {
    console.error(err);
  }
};

const configPassport = (app) => {
  try {
    app.use(passportMethods.init());
    app.use(passportMethods.initSession());
  } catch (err) {
    console.error(err);
  }
};

const initColyseusMonitor = (app) => {
  const basicAuthMiddleware = basicAuth({
    // list of users and passwords
    users: {
      admin: "admin",
    },
    // sends WWW-Authenticate header, which will prompt the user to fill
    // credentials in
    challenge: true,
  });
  app.use("/colyseus", monitor());
};

const initRoutes = (app) => {
  const routePrv: Routes = new Routes();
  routePrv.routes(app);
};

const setupMongoDb = async () => {
  const mongoUrl: string = `mongodb+srv://${process.env.MONGODB_CLIENT}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DATABASE}`;

  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("MongoDB connected…");
  } catch (err) {
    console.error("Error", err);
  }
};

const initServer = async () => {
  const app = express();

  initExpress(app);
  initGameServer(app);
  await setupMongoDb();
  await initDefineRooms();
  initViews(app);
  configPassport(app);
  initColyseusMonitor(app);

  initRoutes(app);
  listenServers(app);
};

initServer();

export const gm = gameServer;
