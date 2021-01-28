import { App } from "./app";

import * as functions from "firebase-functions";

function main() {
  const app = new App();
  return app.getApp();
}

export const app = functions.https.onRequest(main());
