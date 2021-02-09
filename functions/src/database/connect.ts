import admin from 'firebase-admin';
import { Storage } from "@google-cloud/storage";
import path from "path";
const serviceAccount = require('../../permissions.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://its-mine-f713b-default-rtdb.firebaseio.com",
  // storageBucket: "gs://its-mine-f713b.appspot.com",
});
let storage = new Storage({
  keyFilename: path.join(__dirname, "../../itsmineStorage.json"),
  projectId: "colegios-285314",
});

export let db: FirebaseFirestore.Firestore = admin.firestore();
export let myBucket = storage.bucket("its-mine-storage");

// export let myBucket = admin.storage().bucket();
// export let buckets = admin.storage().bucket();

