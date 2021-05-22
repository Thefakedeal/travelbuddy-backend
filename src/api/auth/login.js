const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const { randomString } = require('../../helpers/random');
const User = require('../../model/User');
const Token = require('../../model/Token');

router.post('/', async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email
    });
    if (!await bcrypt.compare(req.body.password, user.password)) {
      return res.status(400).json({ message: 'Invalid Email Or Password' });
    }

    const token = new Token();
    token.user = user._id;
    token.token = randomString(30);
    const savedToken = await token.save();

    res.status(200).json({ token: savedToken.token });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;
