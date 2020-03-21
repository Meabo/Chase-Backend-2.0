import express from "express";
import bodyParser from "body-parser";
import { Routes } from "../src/routes/routes";
import mongoose from "mongoose";
import passport from "passport"
import path from "path"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import expressSession from "express-session"

class Server {
  public app: express.Application = express();
  public routePrv: Routes = new Routes();
  public mongoUrl: string = "mongodb+srv://admin:feelthepain129@cluster0-mimr6.gcp.mongodb.net/chase";

  constructor() {
    this.config();
    this.mongoSetup();
    this.routePrv.routes(this.app);
  }

  private config(): void {
    this.configApplicationMiddleWare()
    this.configViews()
    this.configPassport()
  }

  private configApplicationMiddleWare(): void {
    this.app.use(morgan("combined"));
    this.app.use(cookieParser())
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

  }

  private configViews(): void {
    this.app.set("views", path.join(__dirname + "/../src/views"));
    this.app.set("view engine", "ejs");
  }

  private configPassport(): void {
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  private mongoSetup(): void {
    mongoose
      .connect(this.mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log("MongoDB connected…");
        mongoose.connection.db.listCollections().toArray((err, names) => {
          if (err) console.log("err", err);
          console.log("Collections", names);
        });
      })
      .catch(err => console.log("Error", err));
  }
}

export default new Server().app;
