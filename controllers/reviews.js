const Review=require('../models/reviews')
const Campground=require('../models/campground');

module.exports.CreateReview=async(req,res)=>{
    // res.send('you made it') ;
    const {id}=req.params;
    const campground=await Campground.findById(id);
   
    const review=new Review(req.body.review);
    review.author=req.user._id; // why i dont know i didnt get answer for this
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash('success','Created new Review!!')
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.deleteReview=async(req,res)=>{
    // res.send('Deleting!!!')
    const {id,reviewId}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); // mongo array
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully Deleted a review');
    res.redirect(`/campgrounds/${id}`);
}