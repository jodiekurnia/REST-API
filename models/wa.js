const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const waSchema = new Schema(
  {
    nomor: { type: Number, required: true },
    wa_id: { type: String, required: true },
    isBusiness: { type: Boolean, required: true },
    canReceiveMessage: { type: Boolean, required: true },
    numberExists: { type: Boolean, required: true },
    Date: { type: Date, immutable: true, default: Date.now },
  },
  { collection: 'wa' }
);

waSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

waSchema.set('toJSON', {
  virtuals: true,
});

const wa = model('wa', waSchema);
module.exports = wa;
