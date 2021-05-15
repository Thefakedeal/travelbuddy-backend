const crypto = require('crypto')

const randomString = (size=25)=>{
    return crypto.randomBytes(size).toString('hex')
}

module.exports = {
    randomString
}