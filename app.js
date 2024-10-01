const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const Campground=require('./models/campground');
const methodOverride=require('method-override');
const campground = require('./models/campground');
// the HTML form only allows the GET and POST methods, but RESTful APIs often require PUT, PATCH, and DELETE methods to perform updates or deletions of resources. The method-override middleware allows you to "override" the HTTP method of a request based on parameters in the request body, query string, or headers.
mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("database Connected");
});
const app=express();
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/campgrounds', async(req,res)=>{
    const campgrounds= await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
})
app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
})
app.post('/campgrounds',async(req,res)=>{
    const campground =new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`);
})
app.get('/campgrounds/:id',async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/show',{campground});
})
app.get('/campgrounds/:id/edit',async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});

})
// faking and override is same 
// The browser sends a POST request as normal, but you attach information that signals to the server to treat it as a PUT, DELETE, or another HTTP method.
//  you're sending a POST request but instructing the server to treat it like a PUT request.
app.put('/campgrounds/:id',async(req,res)=>{

    const campground=await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
    // if we remove / in redirect this is depepenedt on current URL after that it appeneds the gieven path
    // if we include / in path it is independent on whatever path we in current html it will always redirect to given path it is best way

})
app.delete('/campgrounds/:id',async(req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})
app.get('/makecampground',async(req,res)=>{
    const camp=new Campground({title:'My Backyard',description:'cheap-camp'});
    await camp.save();
    res.send('camp');
})
app.listen(3000,()=>{
    console.log('serving on port 3000')
})
 