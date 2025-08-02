const multer = require('multer');
const firebaseStrorage = require('multer-firebase-storage');
const serviceAccount = require('../drive-31121-firebase-adminsdk-fbsvc-79d80671b3.json');

const storage = firebaseStrorage({
    credentials: {
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
        projectId: serviceAccount.project_id,
    },
    bucketName: 'drive-31121.firebasestorage.app',
    unique: true,
});

const upload = multer({
    storage: storage,
});

// Debug: log when upload middleware is used
upload._handleFile = function(req, file, cb) {
    try {
        multer.Storage.prototype._handleFile.call(this, req, file, cb);
    } catch (err) {
        console.error('Multer Firebase Storage error:', err);
        cb(err);
    }
};

module.exports = upload;