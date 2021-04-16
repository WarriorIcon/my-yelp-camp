const { string } = require('joi');
const mongoose = require('mongoose');
const Review = require('./reviews');
const Schema = mongoose.Schema;

const ImageSchema = new Schema ({
    url: String,
    filename: String
})
// url format: https://res.cloudinary.com/duuoykiqg/image/upload/w_200/v1618205070/YelpCamp/q43zso8rnnkh3sf7459f.png
ImageSchema.virtual('thumbnail').get(function () {
   return this.url.replace('/upload', '/upload/w_200');
})
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

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
