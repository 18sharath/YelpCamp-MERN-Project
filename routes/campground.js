const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {isLoggedIn,isAuthor}=require('../middleware');
const campgrounds=require('../controllers/campgrounds');



// we can u do this in this format also possible
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,catchAsync(campgrounds.createNewForm));


router.get('/new',isLoggedIn, campgrounds.renderNewForm);
// router.post('/campgrounds',async(req,res,next)=>{
//     try{
//     const campground =new Campground(req.body.campground);
//     await campground.save();
//     res.redirect(`campgrounds/${campground._id}`);
//     }catch(e){
//         next(e);
//     }
// })



router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor,catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground));


// this should be outside
router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(campgrounds.renderEditForm))

// faking and override is same 
// The browser sends a POST request as normal, but you attach information that signals to the server to treat it as a PUT, DELETE, or another HTTP method.
//  you're sending a POST request but instructing the server to treat it like a PUT request.

module.exports = router;


