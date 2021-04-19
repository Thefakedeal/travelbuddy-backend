const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    place: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Place"
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    }
},{
    toJSON: true,
    toObject: true,
    timestamps: true
});

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;

