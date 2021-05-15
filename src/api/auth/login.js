const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../../model/User')
const Token = require('../../model/Token')

router.post('/', async (req,res)=>{
    try{
        const user = await User.findOne({
            email: req.body.email
        });
        if(!await bcrypt.compare(req.body.password,user.password)){
            return res.status(400).json({message: "Invalid Email Or Password"});
        }

        const token = new Token();
        token.user = savedUser._id;
        const savedToken = await token.save();
        
        res.status(200).json({token: savedToken._id});
    }catch(err){
        res.status(400).send(err)
    }
})

module.exports = router