import express, { Application } from "express";
import morgan from "morgan";

// Routes
import database from "./database";
import IndexRouter from "./routes/index.routes";

export class App {
  private app: Application;
  private db: string;

  constructor(private port?: number | string) {
    this.app = express();
    this.db = "mongodb://localhost:27017/test";
    this.settings();
    this.middlewares();
    this.routes();
  }

  settings() {
    this.app.set("port", this.port || process.env.PORT || 3000);
  }

  routes() {
    this.app.use("/", IndexRouter);
  }

  middlewares() {
    const cors = require("cors");

    this.app.use(morgan("dev")); // PARA DECIRLE AL SERVIDOR QUE ESTARÁS ESCUCHANDO
    this.app.use(express.json());
    this.app.use(cors());
  }

  async listen() {
    database({ db: this.db });
    await this.app.listen(this.app.get("port"));
    console.log("SERVER ON PORT", this.app.get("port"));
  }
}
