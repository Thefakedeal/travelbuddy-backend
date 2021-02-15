const mongoose = require('mongoose');

const { Schema } = mongoose;

const ReviewSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    stars: {
        type: Number,
        max: 5,
        min:0,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}) 

const Review = mongoose.Model(ReviewSchema,'Review');

module.exports = Review