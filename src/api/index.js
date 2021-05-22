const express = require('express');

const places = require('./places');
const signup = require('./auth/signup');
const login = require('./auth/login');
const logout = require('./auth/logout');
const user = require('./user');
const reviews = require('./reviews');

const router = express.Router();
router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/signup', signup);
router.use('/login', login);
router.use('/logout', logout);
router.use('/places', places);
router.use('/user', user);
router.use('/reviews', reviews);

module.exports = router;
