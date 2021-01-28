import { App } from "./app";

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const serviceAccount = require("../permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://restapi-js.firebaseio.com",
});

function main() {
  const app = new App();
  return app.getApp();
}

export const app = functions.https.onRequest(main());
