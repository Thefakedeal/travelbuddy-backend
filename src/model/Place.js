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
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    featured_image: {
        type: String,
        required: true,
    }
},
{
    toJSON : {virtuals: true},
    toObject : {virtuals: true},
    timestamps: true,
}
)

PlaceSchema.virtual('reviews',{
    ref: 'Review',
    localField: 'id',
    foreignField: 'place',
    justOne: false,
    options: {sort: -1}
})

PlaceSchema.virtual('images',{
    ref: 'Image',
    localField: 'id',
    foreignField: 'place',
    justOne: false,
    options: {sort: -1}
})

const Place = mongoose.model('Place',PlaceSchema);

module.exports = Place