const Campground = require('./models/campground');
const Review=require('./models/reviews')

module.exports.isLoggedIn = (req, res, next) => {
    // console.log("Req.user..",req.user);

    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; //store the URL user is trying to access before moving into login page

        req.flash('error', 'You must Sign in first!!')
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (!req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
// creating authorization middleware
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You dont have access');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


// if you do not want delete other author review this is the code for below

module.exports.isReview = async (req, res, next) => {
    const { id,reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You dont have access to delete');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}