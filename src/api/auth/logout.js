const express = require("express");
const router = express.Router();
const {userAuthHandler} = require('../../middlewares')
const Token = require("../../model/Token");

router.delete("/", userAuthHandler, async (req, res) => {
    try {
        const token = await Token.findOneAndDelete({token: req.token});
        res.json({message: "Logged Out"});
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;
