import express, { Application } from "express";
import morgan from "morgan";
import path from "path";

// Routes
import UserRouter from "./routes/users.routes";
import Objects from "./routes/objects.routes";
import UploadFiles from "./routes/upload-files.routes";
import Notifications from "./routes/notifications.routes";
import References from "./routes/references.routes";
import Chats from "./routes/chats.routes";
import Messages from "./routes/messages.routes";
import UserTypes from "./routes/user-types.routes";
import ObjectTypes from "./routes/object-types.routes";
import Tags from "./routes/tags.routes";
import Verifications from "./routes/verification.routes";
import Settings from "./routes/setting.routes";


export class App {
  private app: Application;

  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
  }

  settings() {
    this.app.set("port", this.port || process.env.PORT || 3000);
  }

  routes() {
    this.app.use("/users", UserRouter);
    this.app.use("/objects", Objects);
    this.app.use("/upload-files", UploadFiles);
    this.app.use("/notifications", Notifications);
    this.app.use("/references", References);
    this.app.use("/chats", Chats);
    this.app.use("/messages", Messages);
    this.app.use("/object-types", ObjectTypes);
    this.app.use("/user-types", UserTypes);
    this.app.use("/tags", Tags);
    this.app.use("/settings", Settings);
    this.app.use("/verifications", Verifications);
  }

  middlewares() {
    const cors = require("cors");

    this.app.use(morgan("dev")); // PARA DECIRLE AL SERVIDOR QUE ESTARÁS ESCUCHANDO
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use('/public', express.static(path.join(__dirname, "../public")));
    this.app.use(cors());
  }

  async listen() {
    await this.app.listen(this.app.get("port"));
    console.log("SERVER ON PORT", this.app.get("port"));
  }
  getApp() {
    return this.app;
  }
}
