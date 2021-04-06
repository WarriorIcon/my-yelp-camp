// all routes '/campgrounds/:id/reviews'
const express = require('express');
const router = express.Router({mergeParams: true});
const Review = require('../models/reviews');
const reviews = require('../controllers/reviews.js');
const Campground = require('../models/campground');
const {validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');
const catchAsync = require('../utils/catchAsync.js');
const ExpressError = require('../utils/ExpressError.js');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;