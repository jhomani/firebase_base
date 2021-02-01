import admin from 'firebase-admin';
// import serviceAccount from '../../permissions.json';
const serviceAccount = require('../../permissions.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://its-mine-f713b-default-rtdb.firebaseio.com",
  storageBucket: "gs://its-mine-f713b.appspot.com",
});

export let db: any = admin.firestore();
export let buckets = admin.storage().bucket();

// export default { db, storage };
