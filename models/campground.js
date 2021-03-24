const mongoose = require('mongoose');
const Review = require('./reviews');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});
/* This is mongo's weird unintutive way of deleting all
 reviews within a campground (when a campground is deleted)
 see Sec 46 video 468 'Delete Campground Middleware for review*/
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    console.log(doc)
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

//exports
//The first argument is the singular name of the collection your model is for. 
//Mongoose automatically looks for the plural, lowercased version of your model name. 
//Thus, for the example below, the model Campground is for the campgrounds collection in the database.
module.exports = mongoose.model('Campground', CampgroundSchema);
