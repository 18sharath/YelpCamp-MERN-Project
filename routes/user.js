const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const flash = require('connect-flash')
const session = require('express-session');
const { storeReturnTo } = require('../middleware');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res) => {
    // res.send(req.body);
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'WelCome to Campground!!');
            return res.redirect('/campgrounds');
        })
        // console.log(registeredUser);

    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }

}))
router.get('/login', (req, res) => {
    res.render('users/login');
})


router.post('/login',  storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back');
    const redirectUrl=res.locals.returnTo||'/campgrounds';
    res.redirect(redirectUrl);
})


router.get('/logout', (req, res) => {

    req.logout(function (err) {
        if (err) {
            next(err);

        }
        req.flash('success', 'GoodBye!')
        res.redirect('/campgrounds')
    });
})

module.exports = router;
