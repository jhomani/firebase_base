import admin from 'firebase-admin';
// import serviceAccount from '../../permissions.json';
const serviceAccount = require('../../permissions.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db: any = admin.firestore();

export default db;
