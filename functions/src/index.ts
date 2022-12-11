import { App } from "./app";
import * as functions from "firebase-functions";

function main() {
  const app = new App();
  return app.getApp();
}

let app = main();
app.listen(3000)
// export const app = functions.https.onRequest(main());
