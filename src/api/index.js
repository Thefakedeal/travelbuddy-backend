const express = require('express');

const emojis = require('./emojis');

const places = require('./places')

const router = express.Router();


router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/emojis', emojis);

router.use('/places',places);

module.exports = router;
