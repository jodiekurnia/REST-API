const express = require('express');
const Model = require('../models/model');
const Accounts = require('../models/accounts');
const router = express.Router();

//Post
router.get('/post/:serverid/:status', async (req, res) => {
    const data = new Model({
        serverid: req.params.serverid,
        status: req.params.status
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Get all Method
router.get('/getAll', async (req, res) => {
    try {
        const data = await Model.find().select('serverid status -_id');
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get all Exclude ID
router.get('/getAllEx/:serverid', async (req, res) => {
    try {
        const data = await Model.find({serverid: {$ne: req.params.serverid }}).select('serverid status -_id');
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Update by serverid
router.get('/update/:serverid/:status', async (req, res) => {
    try {
        
        const result = await Model.findOneAndUpdate(
            { serverid: req.params.serverid }, { status: req.params.status }
        )

        res.send(result)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


router.post('/accounts', async (req, res) => {
    const account = new Accounts({
        email: req.body.email,
        password: req.body.password,
    });
    try {
        const dataToSave = await account.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});
module.exports = router;