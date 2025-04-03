
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
    for(let i=0;i<200;i++)
    {
        const random1000=Math.floor(Math.random()*1000);
        const priced=Math.floor(Math.random()*30)+10;
        const camp=new Campground({
            author:'670d4aaac93fe9a2bb67f9c7',
            // author:'670d4aaac93fe9a2bb67f9c7',
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            // images: `https://picsum.photos/400?random=${Math.random()}`,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid omnis quaerat ipsam esse voluptate explicabo eaque veritatis optio! Sed, pariatur ad. Delectus ea hic commodi dolore unde, odio totam repudiandae!',
            price:priced,
            geometry: {
              type: "Point",
              coordinates: [
                  cities[random1000].longitude,
                  cities[random1000].latitude,
              ]
          },

            images: [
                {
                  Url: 'https://res.cloudinary.com/dndzomffu/image/upload/v1729692847/YelpCamp/jlruxfwaotyyywsgzpns.png',
                  filename: 'YelpCamp/jlruxfwaotyyywsgzpns',
                },
                {
                  Url: 'https://res.cloudinary.com/dndzomffu/image/upload/v1729692848/YelpCamp/hhawtreqfakux0bmvn7h.png',
                  filename: 'YelpCamp/hhawtreqfakux0bmvn7h',
                }
              ]
            
        })
        await camp.save();

    }
}
// becuase of this async function it is going to return
seedDB().then(()=>{
    mongoose.connection.close();
});