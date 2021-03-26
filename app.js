const express = require("express");
//According to node docs, "The path module provides 
//utilities for working with file and directory paths. 
//It can be accessed using:
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const methodOverride = require('method-Override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users.js')
const campgroundRoutes = require('./routes/campgrounds.js');
const reviewRoutes = require('./routes/reviews.js');

//I believe 27017 is the default mongoose port, followed by 
//the db name. 
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

//logic to check for error connecting to mongo?
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error bro:"));
db.once("open", () => {
    console.log("DATABASE CONNECTED BRO!");
});

const app = express();

//set the directory for all templating engine files (ejs)
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// IMPORTANT: This parses request.body so that it can sent in the form
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }    
}

//flash stuff needs to come before routes. 
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('Success'); //<--capitalization matters here if you capitalize 'success'.
    res.locals.error = req.flash('error');
    next();
});

//use express router to set new default routes for /campgrounds and /reviews:
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

//lets us use static images, scripts, etc from the public folder
app.use(express.static(path.join(__dirname, 'public')));

//establish the website home path to access the home.ejs template
app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error.ejs', {err});
});

// starts server at localhost:3000
app.listen(3000, () => {
    console.log('Serving on port 3000!');
});

//allows you to view on other LAN computers and mobile
// app.listen(3000, '192.168.1.101', function() {
//     console.log('Listening to port: 3000');
// });


// 