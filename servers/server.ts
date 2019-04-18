import * as express from "express";
import * as bodyParser from "body-parser";
import {Routes} from "../src/routes/chaseApi";
import * as mongoose from "mongoose";

class Server {
  public app: express.Application = express();
  public routePrv: Routes = new Routes();
  public mongoUrl: string = "mongodb://localhost:27017/chase-db";

  constructor() {
    this.config();
    this.mongoSetup();
    this.routePrv.routes(this.app);
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
    // serving static files
    this.app.use(express.static("public"));
  }

  private mongoSetup(): void {
    mongoose.Promise = global.Promise;
    mongoose.connect(this.mongoUrl, {useNewUrlParser: true});
  }
}

export default new Server().app;
