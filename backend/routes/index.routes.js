const express = require('express');
const fs = require('fs');
const path = require('path');
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
  try {
    const { file } = req;
    const userId = req.user.userId;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const newFile = await fileModel.create({
      path: file.path, // or file.filename, depending on multer-firebase-storage output
      originalname: file.originalname,
      user: userId,
    });
    res.status(201).json({ message: 'File uploaded', file: newFile });
  } catch (err) {
    res.status(500).json({ message: 'Unexpected upload failure', error: err.message });
  }
});



// Get a signed download URL for a file
router.get('/download/:path', authMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;
    const fileIdentifier = req.params.path;

    const file = await fileModel.findOne({
      user: loggedInUserId,
      path: fileIdentifier
    });

    if (!file) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Fix: Use the correct bucket name for download/view/delete
    const bucketName = 'drive-31121.firebasestorage.app'; // must match your upload bucket
    const signedUrl = await fireBase.storage().bucket(bucketName).file(fileIdentifier).getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 1000 * 10, 
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
    const fileIdentifier = req.params.path;
    const file = await fileModel.findOne({
      user: loggedInUserId,
      path: fileIdentifier
    });

    if (!file) {
      return res.status(401).json({ message: 'Unauthorized or file not found' });
    }
    // Fix: Use the correct bucket name for delete
    const bucketName = 'drive-31121.firebasestorage.app'; // must match your upload bucket
    await fireBase.storage().bucket(bucketName).file(fileIdentifier).delete();
    await fileModel.deleteOne({ user: loggedInUserId, path: fileIdentifier });

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Failed to delete file' });
  }
});

module.exports = router;