const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const Campground=require('../models/campground');




router.get('/', async(req,res)=>{
    const campgrounds= await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
})
router.get('/new',(req,res)=>{
    res.render('campgrounds/new');
})
// router.post('/campgrounds',async(req,res,next)=>{
//     try{
//     const campground =new Campground(req.body.campground);
//     await campground.save();
//     res.redirect(`campgrounds/${campground._id}`);
//     }catch(e){
//         next(e);
//     }
// })
router.post('/',catchAsync(async(req,res,next)=>{
    if(req.body.campground)throw new ExpressError('Invalid Body',404);
    
    const campground =new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`);
   
}))
router.get('/:id',catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show',{campground});
}))
router.get('/:id/edit',catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});

}))
// faking and override is same 
// The browser sends a POST request as normal, but you attach information that signals to the server to treat it as a PUT, DELETE, or another HTTP method.
//  you're sending a POST request but instructing the server to treat it like a PUT request.
router.put('/:id',catchAsync(async(req,res)=>{

    const campground=await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
    // if we remove / in redirect this is depepenedt on current URL after that it appeneds the gieven path
    // if we include / in path it is independent on whatever path we in current html it will always redirect to given path it is best way
    }))
router.delete('/:id',catchAsync(async(req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

module.exports=router