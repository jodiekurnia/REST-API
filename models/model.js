const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    serverid: {
        required: true,
        type: String
    },
    status: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('Data', dataSchema)