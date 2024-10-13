const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsMate =require('ejs-mate'); // A new Ejs tool for layout

const methodOverride=require('method-override');

const ExpressError=require('./utils/ExpressError');
const campgrounds=require('./routes/campground');
const reviews=require('./routes/reviews');

const passport=require('passport');
const LocalStrategy=require('passport-local')

const session=require('express-session');
const flash=require('connect-flash');

// the HTML form only allows the GET and POST methods, but RESTful APIs often require PUT, PATCH, and DELETE methods to perform updates or deletions of resources. The method-override middleware allows you to "override" the HTTP method of a request based on parameters in the request body, query string, or headers.
mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("database Connected");
});
const app=express();

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


app.use(express.urlencoded({extended:true}));
// Parse URL-encoded data (typically from HTML forms).
// Make the parsed data available in req.body.
// Allow complex, nested data structures (when extended: true is used).
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

const sessionconfig={
    secret:'thisshouldbeasecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7 
    }
}

app.use(session(sessionconfig));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');//Setting it in res.locals makes the success message available to all views (templates) 
    // rendered by the server during that request.
    res.locals.error=req.flash('error');
    next();
    
})

app.use('/campgrounds',campgrounds); // routing concept
app.use('/campgrounds/:id/reviews',reviews)  // routing to reviews page

app.use(passport.initialize()); // to initialze passport 
app.use(passport.session());  // if your applications uses persistent login sessions

app.get('/',(req,res)=>{
    res.redirect('/campgrounds') // i  changed here instead of home
})



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
