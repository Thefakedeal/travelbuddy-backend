const router = require('express').Router();
const {adminAuthHandler} = require('../../middlewares')
const places = require('./places')
const reviews = require('./reviews');
const images = require('./images');
const users = require('./users');
router.use(adminAuthHandler);

router.use('/places',places);
router.use('/reviews',reviews);
router.use('/images', images)
router.use('/users', users);

module.exports = router