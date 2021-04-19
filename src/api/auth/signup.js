const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../model/User')

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
    
        const token = jwt.sign({user_id: savedUser._id,is_admin: savedUser.is_admin},process.env.JWT_KEY);
        res.status(201).json({token: token});
    }catch(err){
        res.status(400).send(err);
    }
})

module.exports = router;