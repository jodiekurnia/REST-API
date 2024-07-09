const express = require('express');
const pfModel = require('../models/pfModel');
const router = express.Router();

// Get WhiteList (Get list of registered user IDs)
router.get('/whitelist', async (req, res) => {
  try {
    const data = await pfModel.findOne();
    if (data) {
      res.status(200).json({ status: 'success', userIds: data.userId });
      // Expected response if data exists: { "status": "success", "userIds": [123456789, 987654321] }
    } else {
      res.status(404).json({ status: 'error', message: 'No user IDs found' });
      // Expected response if no data exists: { "status": "error", "message": "No user IDs found" }
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
    // Expected response on server error: { "status": "error", "message": "Internal Server Error" }
  }
});

// Register WhiteList (Register new user ID)
router.get('/reg/:userId', async (req, res) => {
  const { userId } = req.params; // Get userId from URL parameter
  try {
    const data = await pfModel.findOneAndUpdate(
      {},
      { $addToSet: { userId } }, // Use $addToSet to ensure userId is added only if not already present
      { upsert: true, new: true }
    );
    res.status(200).json({ status: 'success', data });
    // Expected response after registration: { "status": "success", "data": { "_id": "ObjectId", "userId": [123456789] } }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message || 'Internal Server Error',
    });
    // Expected response on validation error or server error: { "status": "error", "message": "Validation Error" }
  }
});

module.exports = router;
