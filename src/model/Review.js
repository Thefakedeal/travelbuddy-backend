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
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place'
    }
},{
    toJSON : {virtuals: true},
    toObject : {virtuals: true},
    timestamps: true,
}) 

ReviewSchema.index({user: 1, place: 1}, {unique: true,dropDups: true})

const Review = mongoose.model('Review',ReviewSchema);

module.exports = Review