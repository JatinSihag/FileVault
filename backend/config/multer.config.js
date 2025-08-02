const multer = require('multer');
const firebaseStorage = require('multer-firebase-storage');

let serviceAccount;

if (process.env.FIREBASE_KEY_BASE64) {
  // ✅ Decode base64 string
  serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_KEY_BASE64, 'base64').toString('utf8')
  );
} else {
  // 🧪 Use local file during development
  serviceAccount = require('../drive-31121-firebase-adminsdk-fbsvc-79d80671b3.json');
}

// ✅ Use correct Firebase Storage bucket name
const bucketName = process.env.FIREBASE_STORAGE_BUCKET || 'drive-31121.appspot.com';

const storage = firebaseStorage({
  credentials: {
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'), // important
    projectId: serviceAccount.project_id,
  },
  bucketName: bucketName,
  unique: true,
});

const upload = multer({ storage });

module.exports = upload;
