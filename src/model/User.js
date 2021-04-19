const mongoose =  require('mongoose');

const {Schema} = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    is_admin: {
        type: Boolean,
        default: false,
        required: true
    }
},
    {
        toJSON: { virtuals: true},
        toObject: {virtuals: true}
    }
)

UserSchema.virtual('places',{
    ref: 'Place',
    localField: '_id',
    foreignField: 'user',
    justOne: false,
})

const User = mongoose.model('User', UserSchema);
module.exports = User;