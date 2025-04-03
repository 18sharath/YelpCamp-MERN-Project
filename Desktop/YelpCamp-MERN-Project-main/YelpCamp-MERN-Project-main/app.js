// this setup helps maintain environment-specific configurations, 
// makes development easier, and keeps sensitive information secure.

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}




const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsMate =require('ejs-mate'); // A new Ejs tool for layout

const methodOverride=require('method-override');

const ExpressError=require('./utils/ExpressError');

const passport=require('passport');
const LocalStrategy=require('passport-local')

const session=require('express-session');
const flash=require('connect-flash');

const User=require('./models/user');

const userRouter=require('./routes/user');
const campgroundsRouter=require('./routes/campground');
const reviewsRouter=require('./routes/reviews');
const { log } = require('console');

const mongoSanitize = require("express-mongo-sanitize");



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
// Serve static files

app.use(express.static(path.join(__dirname,'public')));

app.get('/favicon.ico', (req, res) => res.status(204));  // nane hakiddu not in video
app.use(mongoSanitize())
const sessionconfig={
    name:"session",
    secret:'thisshouldbeasecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7 
    }
}

app.use(session(sessionconfig));
app.use(flash());
// app.use(helmet({contentSecurityPolicy: false}));
// // this should be before any other routes


// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://api.mapbox.com/",
//     "https://kit.fontawesome.com/",
//     "https://cdnjs.cloudflare.com/",
//     "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com/",
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.mapbox.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://fonts.googleapis.com/",
//     "https://use.fontawesome.com/",
// ];
// const connectSrcUrls = [
//     "https://api.mapbox.com/",
//     "https://a.tiles.mapbox.com/",
//     "https://b.tiles.mapbox.com/",
//     "https://events.mapbox.com/",
// ];
// const fontSrcUrls = [];
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://res.cloudinary.com/douqbebwk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
//                 "https://images.unsplash.com/",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );


app.use(passport.initialize()); // to initialze passport 
app.use(passport.session());  // if your applications uses persistent login sessions

app.use((req,res,next)=>{
    // console.log(req.session);
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');//Setting it in res.locals makes the success message available to all views (templates) 
    // rendered by the server during that request.
    res.locals.error=req.flash('error');
    next();
})


app.get('/fakeUser',async(req,res)=>{
    const user=new User({email:'sharath@gmaul.com',username:'sharath'}); 
    const newUser=await User.register(user,'ppp'); // inbuilt in passport-local-mongoose it takes two paramenter username and password and it create a hash code in database
    res.send(newUser);
})
// Promises help avoid "callback hell", where nested callbacks can make code hard to read and maintain. 
// With promises, you can write cleaner and more manageable asynchronous code.

app.use('/',userRouter);
app.use('/campgrounds',campgroundsRouter); // routing concept
app.use('/campgrounds/:id/reviews',reviewsRouter)  // routing to reviews page


passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.get('/',(req,res)=>{
    // res.redirect('/campgrounds') // i  changed here instead of home
    res.render('home')
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


// Asynchronization (or asynchronous programming) is a concept where tasks can run independently from the main program flow,
// allowing other operations to proceed without waiting for the completion of these tasks. In other words, it allows you to handle multiple tasks simultaneously, improving the efficiency and responsiveness of your program.