const express = require('express');
const chiaModel = require('../models/chiaModel');
const maxPlotsModel = require('../models/maxPlotsModel');
const router = express.Router();

// Post
router.get('/register/:serverid/:status', async (req, res) => {
  const { serverid, status } = req.params;
  try {
    // Find a document with the given serverid
    let data = await chiaModel.findOneAndUpdate(
      { serverid }, // Search condition
      { serverid, status }, // Update or insert data
      { upsert: true, new: true } // Options: create if not exists, return updated document
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all Method
router.get('/getAll', async (req, res) => {
  try {
    const data = await chiaModel.find({}, { serverid: 1, status: 1, _id: 0 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Max Plot
router.get('/getMaxPlot', async (req, res) => {
  try {
    const data = await maxPlotsModel.findOne();
    if (data) {
      res.status(200).json({ status: 'success', maxPlots: data.maxPlots });
    } else {
      res.status(404).json({ status: 'error', message: 'No maxPlots found' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Post Max Plot
router.get('/setMaxPlot/:maxPlots', async (req, res) => {
  const { maxPlots } = req.params;
  try {
    const data = await maxPlotsModel.findOneAndUpdate(
      {},
      { maxPlots },
      { upsert: true, new: true }
    );
    res.status(200).json(data);
  } catch (error) {
    const message = error.message || 'Internal Server Error';
    res.status(400).json({ message });
  }
});

module.exports = router;
