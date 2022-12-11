const {initializeApp, cert} = require('firebase-admin/app') ;
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('./permissions.json');

initializeApp({
  credential: cert(serviceAccount),
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
