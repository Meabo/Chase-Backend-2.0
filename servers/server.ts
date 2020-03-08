import express from "express";
import bodyParser from "body-parser";
import {Routes} from "../src/routes/chaseApi";
import mongoose from "mongoose";

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
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
    // serving static files
    this.app.use(express.static("public"));
  }

  private mongoSetup(): void {
    mongoose
      .connect(this.mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true})
      .then(() => {
        console.log("MongoDB connected…");
        mongoose.connection.db.listCollections().toArray(function(err, names) {
          if (err)
            console.log('err', err);
          console.log('Collections', names)
        });
      })
      .catch((err) => console.log("Error", err));
  }
}

export default new Server().app;
