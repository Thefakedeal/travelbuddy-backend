const mongoose = require('mongoose');

const {Schema, model} = mongoose

const TokenSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
})


const Token = model('Token', TokenSchema);
module.exports= Token;