const express=require('express');
const router=express.Router();
const User=require('../models/user');
const catchAsync=require('../utils/catchAsync');
const passport=require('passport');
const flash=require('connect-flash')
const session = require('express-session');
router.get('/register',(req,res)=>{
    res.render('users/register');
});

router.post('/register',catchAsync(async(req,res)=>{
    // res.send(req.body);
    try{
    const {username,email,password}=req.body;
    const user=new User({username,email});
    const registeredUser=await User.register(user,password);

    // console.log(registeredUser);
    req.flash('success','Welcome to Campground!!');
    res.redirect('/campgrounds');
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
    
}))
router.get('/login',(req,res)=>{
    res.render('users/login');
})

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','Welcome back');
    res.redirect('/campgrounds');
})

module.exports=router;
