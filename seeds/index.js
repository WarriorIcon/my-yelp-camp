//this file  is used to seed our database
const mongoose = require('mongoose');
const cities  = require('./cities.js');
const Campground = require('../models/campground');
const {descriptors, places } = require('./seedhelpers.js');


//I believe 27017 is the default mongoose port, followed by 
//the db name. 
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

//logic to check for error connecting to mongo?
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error bro:"));
db.once("open", () => {
    console.log("DATABASE CONNECTED BRO!");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '605a10ee1692b35d2cc2e478',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae, ipsam. Culpa officia itaque sunt sed iure harum quas accusamus architecto quisquam, recusandae dolorum ab, eos nihil? Facilis esse odio recusandae.',
            price: `${price}`,
            images:  [
                {
                  url: 'https://res.cloudinary.com/duuoykiqg/image/upload/v1617867692/YelpCamp/rdxrlzhvjgdihl2ts4hv.jpg',
                  filename: 'YelpCamp/rdxrlzhvjgdihl2ts4hv'
                },
                {
                  url: 'https://res.cloudinary.com/duuoykiqg/image/upload/v1617867693/YelpCamp/skc9mrvmx3xmxbqkrfrp.jpg',
                  filename: 'YelpCamp/skc9mrvmx3xmxbqkrfrp'
                }
              ]
        })
        await camp.save();
    }
}

// Seed the DB then close the connection when it's finished.
seedDB().then(() => {
    mongoose.connection.close();
});