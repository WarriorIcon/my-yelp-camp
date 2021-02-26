const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});

//exports
//The first argument is the singular name of the collection your model is for. 
//Mongoose automatically looks for the plural, 
//lowercased version of your model name. 
//Thus, for the example below, the model Campground is for the campgrounds collection in the database.
module.exports = mongoose.model('Campground', CampgroundSchema);
