
// Refactor: instead of module.exports for all of these. I could be put all in an object and just export that object
const User = require('../models/user');

module.exports.renderRegister =  (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res, next) => {
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
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login =  (req, res) => {
    req.flash('Success', "Weclome Back!");
    const redirectUrl = req.session.returnTo || '/campgrounds';
    //deletes returnTo off the session obkect now that its stored in a variable
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('Success', "Successfully logged out! See you later!")
    res.redirect('/campgrounds');
}