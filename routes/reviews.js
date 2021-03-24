// all routes '/campgrounds/:id/reviews'
const express = require('express');
const router = express.Router({mergeParams: true});
const {reviewSchema} = require('../schemas.js');
const Review = require('../models/reviews');
const Campground = require('../models/campground');

const catchAsync = require('../utils/catchAsync.js');
const ExpressError = require('../utils/ExpressError.js');

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
       throw new ExpressError(msg, 400); 
    } else { 
        next();
    }
}

router.post('/', validateReview, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('Success', 'Review successfully added!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res,) => {
    const {id, reviewId} = req.params;
    // Mongo Pull. We must delete the reference to this specific review from this specific campground
    //"Take this ID and pull anything with that id out of the reviews array (an array of IDs.):
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    //delete the review itself:
    await Review.findByIdAndDelete(reviewId);
    req.flash('Success', 'Review deleted!');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;