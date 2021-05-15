const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { randomString } = require('../../helpers/random')
const User = require('../../model/User')
const Token = require('../../model/Token')

router.post('/', async (req,res)=>{
    try{
        const user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        user.password = hashedPassword;
        user.is_admin = false;
        const savedUser= await user.save();
        
        const token = new Token();
        token.user = savedUser._id;
        token.token = randomString(30);
        const savedToken = await token.save();

        res.status(201).json({token: savedToken.token});
    }catch(err){
        res.status(400).send(err);
    }
})

module.exports = router;