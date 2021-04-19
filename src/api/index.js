const express = require('express');

const places = require('./places')
const signup = require('./auth/signup')
const login = require('./auth/login');
const router = express.Router();


router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/signup', signup);
router.use('/login', login);
router.use('/places',places);

module.exports = router;
