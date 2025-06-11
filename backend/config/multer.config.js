
const multer = require('multer')
const firebaseStrorage = require('multer-firebase-storage')
const firebase = require('./firebase.config')
const serviceAccount = require('../drive-31121-firebase-adminsdk-fbsvc-50fc691f6e.json')

const storage = firebaseStrorage({
    credentials:firebase.credential.cert(serviceAccount),
    bucketName : 'gs://drive-31121.firebasestorage.app',
    unique:true,
})

const upload = multer({
    storage : storage,
})

module.exports = upload