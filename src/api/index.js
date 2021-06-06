const express = require('express');

const places = require('./places');
const signup = require('./auth/signup');
const login = require('./auth/login');
const logout = require('./auth/logout');
const user = require('./user');
const reviews = require('./reviews');
const images = require('./images');
const admin = require('./admin');

const router = express.Router();
router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/admin', admin);
router.use('/signup', signup);
router.use('/login', login);
router.use('/logout', logout);
router.use('/places', places);
router.use('/user', user);
router.use('/reviews', reviews);
router.use('/images', images);

module.exports = router;
