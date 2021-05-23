const mongoose = require('mongoose');

const { Schema } = mongoose;

const ReviewSchema = new Schema({
  comment: {
    type: String,
  },
  stars: {
    type: Number,
    max: 5,
    min: 0,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  place: {
    type: Schema.Types.ObjectId,
    ref: 'Place',
    required: true,
  },
  flagged: {
    type: Boolean,
    default: false,
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
});

ReviewSchema.index({ user: 1, place: 1 }, { unique: true, dropDups: true });

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
