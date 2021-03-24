//All post routes /campgrounds
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js');
const {campgroundSchema} = require('../schemas.js');
const ExpressError = require('../utils/ExpressError.js');
const Campground = require('../models/campground');

// Joi function for client side validating 
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
       throw new ExpressError(msg, 400); 
    } else { 
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', {campgrounds})
}));

router.get('/new', (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must sign in to access this page!');
        res.redirect('/login');
    }
    res.render('campgrounds/new');
});

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('Success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

// this shouldn't even be an existing route should it?
router.get('/show', (req, res) => {
    res.render('campgrounds/show');
});

//very IMPORTANT that campgrounds/new route must come before this one
//as this route claims anything that comes after campgrounds/ as n ID route.
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground}); 
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground}); 
}));

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{ ...req.body.campground });
    req.flash('Success', 'Campground successfully updated!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('Success', 'Campground successfully deleted!');
    res.redirect('/campgrounds');
}));

module.exports = router;