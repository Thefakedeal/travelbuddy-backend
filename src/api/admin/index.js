const router = require('express').Router();
const {adminAuthHandler} = require('../../middlewares')
const places = require('./places')
const reviews = require('./reviews');


router.use(adminAuthHandler);

router.use('/places',places);
router.use('/reviews',reviews);

module.exports = router