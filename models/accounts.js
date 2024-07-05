const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const accountSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, immutable: true },
    subs: { type: Array, default: [] },
  },
  { collection: 'accounts' }
);

accountSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

accountSchema.set('toJSON', {
  virtuals: true,
});

const Account = model('Account', accountSchema);
module.exports = Account;
