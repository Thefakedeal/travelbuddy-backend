const Review = require('../src/model/Review')
const Place = require('../src/model/Place')
const User = require('../src/model/User')
const faker = require('faker');


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

async function randomUser(){
    const count = 50;  // User.count
    var random = Math.floor(Math.random() * count)
    const user = await User.findOne().skip(random).exec();
    return user;
}

async function randomPlace(){
    const count = 200;  // Place.count
    var random = Math.floor(Math.random() * count)
    const place = await Place.findOne().skip(random).exec();
    return place;
}

async function seedReview(placeID, userID){
    try{
        
        const review = new Review();
        review.comment = faker.random.words(10);
        review.stars = getRndInteger(1,5);
        review.user = placeID;
        review.place = userID;
        return review.save();
    }catch(err){
        console.log(err);
    }   
}

async function seedReviews(){
    const users = await User.find();
    const places = await Place.find();
    for (let i=0; i< users.length; i++) {
        for (let j=0; j< places.length; j++) {
            await seedReview(places[j].id, users[i].id);
        }
    }
    console.log("reviews seeded");
}

module.exports = seedReviews