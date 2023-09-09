const express = require('express');
const Model = require('../models/model');
const Accounts = require('../models/accounts');
const Wa = require('../models/wa');
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

/* This is New, All Accounts */
router.post('/accounts', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if an account with the provided email already exists
        const existingAccount = await Accounts.findOne({ email });

        if (existingAccount) {
            return res.status(400).json({ message: "Account already exists" });
        }

        // If the account doesn't exist, create and save the new account
        const account = new Accounts({
            email,
            password,
        });

        const dataToSave = await account.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(500).json({ message: "An error occurred" });
    }
});
router.get('/accounts/:subs', async (req, res) => {
    try {
        const data = await Accounts.findOne({subs: {$nin: req.params.subs}});
        if (!data) {
            return res.status(404).json({ message: "No Account Available" });
        }
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});
router.post('/accounts/:subs', async (req, res) => {
    try {
        const result = await Accounts.findOneAndUpdate(
            { email: req.body.email },
            { $push: { subs: req.params.subs } },
            { new: true } // This option returns the updated document
        )
        res.send(result)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

// WA API
router.post('/wa', async (req, res) => {
    const { nomor, wa_id, isBusiness, canReceiveMessage, numberExists } = req.body;

    try {
        // Check if an WA with the provided email already exists
        const existingWA = await Wa.findOne({ wa_id });

        if (existingWA) {
            return res.status(400).json({ message: "This Number Already Exists" });
        }

        // If the account doesn't exist, create and save the new account
        const WA = new Wa({
            nomor,
            wa_id,
            isBusiness,
            canReceiveMessage,
            numberExists
        });

        const dataToSave = await WA.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(500).json({ message: "An error occurred" });
    }
});
module.exports = router;