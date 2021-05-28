const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  place: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Place'
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  flagged: {
    type: Boolean,
    default: false,
  }
},{
  toJSON:{ virtuals: true},
  toObject: {virtuals: true},
  timestamps: {virtuals: true}
});

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;
