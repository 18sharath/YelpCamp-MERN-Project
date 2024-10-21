const User = require('../models/user');


module.exports.renderRegister=(req, res) => {
    res.render('users/register');
}

module.exports.register=async (req, res) => {
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

}

module.exports.renderlogin=(req, res) => {
    res.render('users/login');
}

module.exports.login=(req, res) => {
    req.flash('success', 'Welcome back');
    const redirectUrl=res.locals.returnTo||'/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logout=(req, res) => {

    req.logout(function (err) {
        if (err) {
            next(err);

        }
        req.flash('success', 'GoodBye!')
        res.redirect('/campgrounds')
    });
}