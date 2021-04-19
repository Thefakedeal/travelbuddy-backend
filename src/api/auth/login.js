const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../model/User')


router.post('/', async (req,res)=>{
    try{
        const user = await User.findOne({
            email: req.body.email
        });
        if(!await bcrypt.compare(req.body.password,user.password)){
            return res.status(400).json({message: "Invalid Email Or Password"});
        }
        const token = jwt.sign({user_id: user._id,is_admin: user.is_admin}, process.env.JWT_KEY);
        res.status(200).json({token});
    }catch(err){
        res.status(400).send(err)
    }
})

module.exports = router