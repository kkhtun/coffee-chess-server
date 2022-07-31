const firebaseAdminSdk = require("firebase-admin");
const serviceAccount = require("../configs/firebase-service-account-dev.config.json");
firebaseAdminSdk.initializeApp({
    credential: firebaseAdminSdk.credential.cert(serviceAccount),
});

module.exports = ({}) => ({
    verifyToken: (token) => firebaseAdminSdk.auth().verifyIdToken(token),
});
