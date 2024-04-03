const express = require('express');
const chiaModel = require('../models/chiaModel');
const router = express.Router();

// Post
router.get('/register/:serverid/:status', async (req, res) => {
  const data = new chiaModel({
      serverid: req.params.serverid,
      status: req.params.status
  });

  try {
      const dataToSave = await data.save();
      res.status(200).json(dataToSave);
  }
  catch (error) {
      res.status(400).json({ message: error.message });
  }
});

// Get all Method
router.get('/getAll', async (req, res) => {
  try {
      const data = await Model.find().select('serverid status -_id');
      res.json(data);
  }
  catch (error) {
      res.status(500).json({ message: error.message });
  }
});



module.exports = router;