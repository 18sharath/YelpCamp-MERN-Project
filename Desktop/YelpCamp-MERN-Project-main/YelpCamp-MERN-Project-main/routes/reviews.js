
const express=require('express');
const router=express.Router({mergeParams:true});
const Review=require('../models/reviews')
const Campground=require('../models/campground');
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const {isLoggedIn,isReview}=require('../middleware');
const reviews=require('../controllers/reviews');




router.post('/',isLoggedIn,catchAsync(reviews.CreateReview))
// deleting the reviews

router.delete('/:reviewId',isLoggedIn,isReview,catchAsync(reviews.deleteReview));

module.exports=router;