const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync.js')
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('Success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login')
})
//passport code, show flashmessage and redirect to '/login' if login fails
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('Success', "Weclome Back!");
    res.redirect('/campgrounds');
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('Success', "Successfully logged out! See you later!")
    res.redirect('/campgrounds');
});

module.exports = router;
