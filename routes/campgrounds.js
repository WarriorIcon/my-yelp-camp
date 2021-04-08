//All post routes /campgrounds
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js');
const campgrounds = require('../controllers/campgrounds.js')
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');
const {storage} = require('../cloudinary');
const multer  = require('multer');
const upload = multer({ storage });

//code for routes has been refactored to the corresponding controllers folder
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))


router.get('/new', isLoggedIn, campgrounds.renderNewForm);

//very IMPORTANT that campgrounds/new route must come before this one
//as this route claims anything that comes after campgrounds/ as n ID route.
router.route('/:id')
.get(catchAsync(campgrounds.showCampground))
.put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));



module.exports = router;