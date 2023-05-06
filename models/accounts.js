const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const accountSchema = new Schema({
    email : {type: String,required: true},
    password : {type: String,required: true},
    createdAt: {type: Date, default: Date.now, immutable: true},
    updatedAt: {type: Date, default: Date.now},
    created_ip: {type: String, default: null},
    lastUsed:  {type: Date, default: null},
    successSubs: {type: Boolean, default: false},
}, {collection: 'accounts'});

accountSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

accountSchema.set('toJSON', {
    virtuals: true,
});

const Account = model('Account', accountSchema);
module.exports = Account;