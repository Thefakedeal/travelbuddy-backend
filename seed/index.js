const mongoose = require('mongoose');
require('dotenv').config();
// const seedUsers = require('./user');
// const seedPlaces = require('./place');
const seedReviews = require('./review');

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (!err) {
    console.log('Connected');
  } else {
    console.log(err);
  }
});

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


// seedUsers();
// seedPlaces();
seedReviews();