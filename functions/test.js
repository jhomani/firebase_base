const {initializeApp, cert, applicationDefault} = require('firebase-admin/app') ;
const { getFirestore } = require('firebase-admin/firestore');
// const { google } = require("googleapis");

const serviceAccount = require('./permissions.json');

// const oAuthClient = new google.auth.OAuth2(
// process.env.CLIENT_ID,
// process.env.CLIENT_SECRET,
// process.env.REDIRECT_URL
// )
console.log(serviceAccount);

initializeApp({
    // credential: applicationDefault(),
    // databaseURL: 'https://tso-db.firebaseio.com'

//   credential: cert(serviceAccount),
  credential: cert(serviceAccount),
    // serviceAccountId: 'firebase-adminsdk-8weon@crud-tso.iam.gserviceaccount.com'
  // databaseURL: "https://tso-db-default-rtdb.firebaseio.com/",

  // storageBucket: "gs://its-mine-f713b.appspot.com",
});
// let storage = new Storage({
//   keyFilename: path.join(__dirname, "../../itsmineStorage.json"),
//   projectId: "colegios-285314",
// });

let db = getFirestore();
// export let myBucket = storage.bucket("its-mine-storage");

// export let myBucket = admin.storage().bucket();
// export let buckets = admin.storage().bucket();


const docRef = db.collection('users').doc('alovelace');

docRef.set({
  first: 'Ada',
  last: 'Lovelace',
  born: 1815
});
