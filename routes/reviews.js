
const express=require('express');
const router=express.Router({mergeParams:true});
const Review=require('../models/reviews')
const Campground=require('../models/campground');
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const {isLoggedIn}=require('../middleware');





router.post('/',isLoggedIn,catchAsync(async(req,res)=>{
    // res.send('you made it') ;
    const {id}=req.params;
    const campground=await Campground.findById(id);
   
    const review=new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash('success','Created new Review!!')
    res.redirect(`/campgrounds/${campground._id}`)
}))
// deleting the reviews

router.delete('/:reviewId',isLoggedIn,catchAsync(async(req,res)=>{
    // res.send('Deleting!!!')
    const {id,reviewId}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); // mongo array
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully Deleted a review');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports=router;