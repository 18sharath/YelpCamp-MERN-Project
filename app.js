const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsMate =require('ejs-mate'); // A new Ejs tool for layout
const Campground=require('./models/campground');
const methodOverride=require('method-override');
const campground = require('./models/campground');
const ExpressError=require('./utils/ExpressError');
const catchAsync=require('./utils/catchAsync');
const Joi=require('joi');
// the HTML form only allows the GET and POST methods, but RESTful APIs often require PUT, PATCH, and DELETE methods to perform updates or deletions of resources. The method-override middleware allows you to "override" the HTTP method of a request based on parameters in the request body, query string, or headers.
mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("database Connected");
});
const app=express();
app.engine('ejs',ejsMate);
app.use(express.urlencoded({extended:true}));
// Parse URL-encoded data (typically from HTML forms).
// Make the parsed data available in req.body.
// Allow complex, nested data structures (when extended: true is used).
app.use(methodOverride('_method'));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.get('/',(req,res)=>{
    res.redirect('/campgrounds') // i  changed here instead of home
})
app.get('/campgrounds', async(req,res)=>{
    const campgrounds= await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
})
app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
})
// app.post('/campgrounds',async(req,res,next)=>{
//     try{
//     const campground =new Campground(req.body.campground);
//     await campground.save();
//     res.redirect(`campgrounds/${campground._id}`);
//     }catch(e){
//         next(e);
//     }
// })
app.post('/campgrounds',catchAsync(async(req,res,next)=>{
    if(req.body.campground)throw new ExpressError('Invalid Body',404);
    
    const campground =new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`);
   
}))
app.get('/campgrounds/:id',catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/show',{campground});
}))
app.get('/campgrounds/:id/edit',catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});

}))
// faking and override is same 
// The browser sends a POST request as normal, but you attach information that signals to the server to treat it as a PUT, DELETE, or another HTTP method.
//  you're sending a POST request but instructing the server to treat it like a PUT request.
app.put('/campgrounds/:id',catchAsync(async(req,res)=>{

    const campground=await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
    // if we remove / in redirect this is depepenedt on current URL after that it appeneds the gieven path
    // if we include / in path it is independent on whatever path we in current html it will always redirect to given path it is best way
    }))
app.delete('/campgrounds/:id',catchAsync(async(req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))
app.all('*',(req,res,next)=>{
    // res.send('404!!!');
    next(new ExpressError('Page Not Found',404));
})

app.use((err,req,res,next)=>{
    // const {status=500,message='something went wrong'}=err;
    const {status=500}=err;
    if(!err.message)err.message='Oh No, something went wrong';
    // res.status(status).send(message);
    res.status(status).render('error',{err});
    // res.send('Ohh Boy, something went wrong!');
})
app.listen(3000,()=>{
    console.log('serving on port 3000')
})
 