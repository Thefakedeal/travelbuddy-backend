const express = require("express");
const router = express.Router();
const Token = require("../../model/Token");

router.delete("/", async (req, res) => {
    try {
        const token = await Token.findByIdAndDelete(req.body.token);
        res.json({message: "Logged Out"});
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;
