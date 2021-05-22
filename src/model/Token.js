const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const TokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  }
});

TokenSchema.index({ token: 1 });
const Token = model('Token', TokenSchema);
module.exports = Token;
