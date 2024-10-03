
const mongoose=require('mongoose');
const cities=require('./cities');
const {places,descriptors}=require('./seedHelpers');
const Campground=require('../models/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("database Connected");
});
const sample=array=>array[Math.floor(Math.random()*array.length)];
const seedDB=async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++)
    {
        const random1000=Math.floor(Math.random()*1000);
        const priced=Math.floor(Math.random()*30)+10;
        const camp=new Campground({
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            // images: `https://picsum.photos/400?random=${Math.random()}`,
            images:"https://picsum.photos/400/400",
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid omnis quaerat ipsam esse voluptate explicabo eaque veritatis optio! Sed, pariatur ad. Delectus ea hic commodi dolore unde, odio totam repudiandae!',
            price:priced
            
        })
        await camp.save();

    }
}
// becuase of this async function it is going to return
seedDB().then(()=>{
    mongoose.connection.close();
});