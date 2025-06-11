const Firebase = require('firebase-admin');
const serviceAccount = require('../drive-31121-firebase-adminsdk-fbsvc-50fc691f6e.json')

const firebase = Firebase.initializeApp({ 
    credential:Firebase.credential.cert(serviceAccount),
    storageBucket:"gs://drive-31121.firebasestorage.app",   
})

module.exports = Firebase