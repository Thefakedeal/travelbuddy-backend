const express = require("express");

const router = express.Router();
const bcrypt = require("bcrypt");
const { randomString } = require("../../helpers/random");
const User = require("../../model/User");
const Token = require("../../model/Token");
const { body, validationResult } = require("express-validator");

router.post(
  "/",
  body("email").normalizeEmail().isEmail(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findOne({
        email: req.body.email,
      });
      if (!user) {
        return res.status(400).json({
          message: "User Doesn't exist",
        });
      }
      if (!(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(400).json({ message: "Invalid Email Or Password" });
      }

      const token = new Token();
      token.user = user._id;
      token.token = randomString(30);
      const savedToken = await token.save();

      res.status(200).json({ token: savedToken.token });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
