const Review = require('../models/reviews');
const Campground = require('../models/campground');


// requests go to '/campgrounds/:id/reviews' through express router

module.exports.createReview = async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('Success', 'Review successfully added!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res,) => {
    const {id, reviewId} = req.params;
    // Mongo Pull. We must delete the reference to this specific review from this specific campground
    //"Take this ID and pull anything with that id out of the reviews array (an array of IDs.):
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    //delete the review itself:
    await Review.findByIdAndDelete(reviewId);
    req.flash('Success', 'Review deleted!');
    res.redirect(`/campgrounds/${id}`);
}