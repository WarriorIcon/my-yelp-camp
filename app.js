const express = require("express");
//According to node docs, "The path module provides 
//utilities for working with file and directory paths. 
//It can be accessed using:
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-Override');
const Campground = require('./models/campground');

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
    console.log("Database connected BRO!");
});

const app = express();

//set the directory for all templating engine files (ejs)
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// IMPORTANT: This parses request.body so that it can sent in the form
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

//establish the website home path to access the home.ejs template
app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', {campgrounds})
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

app.get('/campgrounds/show', (req, res) => {
    res.render('campgrounds/show');
});

//very IMPORTANT that campgrounds/new route must come before this one
//as this route claims anything that comes after campgrounds/ as n ID route.
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground}); //why do we render {campground} here?
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground}); //why do we render {campground} here?
});

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{ ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
});

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});


//starts server at localhost:3000
app.listen(3000, () => {
    console.log('Serving on port 3000!');
});