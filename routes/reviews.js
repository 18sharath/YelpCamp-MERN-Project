
const express=require('express');
const router=express.Router();
const Review=require('../models/reviews')
const Campground=require('../models/campground');
const catchAsync=require('../utils/catchAsync');






router.post('/',catchAsync(async(req,res)=>{
    // res.send('you made it') ;
    const campground=await Campground.findById(req.params.id);
    const review=new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))
// deleting the reviews

router.delete('/:reviewId',catchAsync(async(req,res)=>{
    // res.send('Deleting!!!')
    const {id,reviewId}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); // mongo array
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports=router;