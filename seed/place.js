const Place = require('../src/model/Place');
const User = require('../src/model/User');
const faker = require('faker');


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getRndFloat(min, max) {
    return (Math.random() * (max - min ) ) + min;
}

async function randomUser(){
    const count = 50;  // User.count
    var random = Math.floor(Math.random() * count)
    const user = await User.findOne().skip(random).exec();
    return user;
}

async function seedPlace(){
    try{
        const place = new Place();
        place.name = faker.address.streetName();
        place.location = {
            type: "Point",
            coordinates: [getRndFloat(87.271731,87.291731), getRndFloat(26.784386,26.804386)]
        }
        place.description = faker.random.words(20);
        const user = await randomUser();
        place.user = user.id;
        place.featured_image = `/images/place${getRndInteger(0,22)}.jpg`;
        const newPlace = await place.save();
        return newPlace;
    }catch(err){
        console.log(err);
    }
}

async function seedPlaces(){
    for(let i=0; i<200;i++){
        await seedPlace();
    }
    console.log("Places seeded")
}

module.exports = seedPlaces;