const mongoose = require('mongoose');
const {Schema} = mongoose;

const PlaceSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    lat: {
        type: Number,
        required: true,
    },
    lon: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]
})

const Place = mongoose.model('Place',PlaceSchema);

module.exports = Place