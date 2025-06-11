const express = require('express');
const router = express.Router();
const upload = require('../config/multer.config');
const fileModel = require('../Models/files.models');
const authMiddleware = require('../middlewares/auth');
const fireBase = require('../config/firebase.config');

// Get all files for the logged-in user
router.get('/home', authMiddleware, async (req, res) => {
  const userFiles = await fileModel.find({
    user: req.user.userId
  });
  return res.json({ files: userFiles });
});

// Upload a file
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  const newFile = await fileModel.create({
    path: req.file.path,
    originalname: req.file.originalname,
    user: req.user.userId
  });
  res.send(newFile);
});

// Get a signed download URL for a file
router.get('/download/:path', authMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;
    const path = req.params.path;

    const file = await fileModel.findOne({
      user: loggedInUserId,
      path: path
    });

    if (!file) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const signedUrl = await fireBase.storage().bucket().file(path).getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 1000 * 10, // 10 mins
    });

    return res.status(200).json({ url: signedUrl[0] });

  } catch (error) {
    console.error("Error generating download URL:", error);
    res.status(500).json({ message: 'Download failed' });
  }
});

// Delete a file
router.delete('/delete/:path', authMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;
    const path = req.params.path;

    // Find the file in the database and ensure it belongs to the user
    const file = await fileModel.findOne({
      user: loggedInUserId,
      path: path
    });

    if (!file) {
      return res.status(401).json({ message: 'Unauthorized or file not found' });
    }

    // Delete from Firebase Storage
    await fireBase.storage().bucket().file(path).delete();

    // Delete from MongoDB
    await fileModel.deleteOne({ user: loggedInUserId, path: path });

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Failed to delete file' });
  }
});

module.exports = router;