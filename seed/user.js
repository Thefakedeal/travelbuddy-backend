const User = require('../src/model/User');
const faker = require('faker');
const bcrypt = require('bcrypt');


async function seedUser(){
    try{
        const user = new User();
        user.name = faker.name.findName();
        user.email = faker.internet.email();
        user.password = "$2b$10$PzqnauV69jHYKshknZa4aeRAKGI1/C5NveYTDZgr2qRbYuYbPQdCq"; //password
        user.is_admin = false;
        const savedUser = await user.save();
        return savedUser;
    }catch(err){
        console.log(err);
    }
}

async function seedUsers(){
    try{
        const admin = new User();
        admin.name = 'Admin';
        admin.email = 'admin@admin.com';
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash('admin', salt);
        admin.password = hashedPassword;
        admin.is_admin = true;
        await admin.save();

        const user = new User();
        user.name = 'user';
        user.email = 'user@user.com';
        const hashedPasswordUser = await bcrypt.hash('user', salt);
        user.password = hashedPasswordUser;
        user.is_admin = false;
        await user.save();

        for(let i=0; i<50; i++){
            await seedUser()
        }

        console.log("Users Seeded");
    }catch(err){
        console.log(err);
    }
}

module.exports = seedUsers;