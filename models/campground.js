const { required } = require('joi');
const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require('./reviews')
const User=require('./user');
const CampgroundSchema=new Schema({
    title:String,
    images:String,
    price:Number,
    description:String,
    location:String,
    author:
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    ,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
});
CampgroundSchema.post('findOneAndDelete',async function(doc){
    // console.log('Deleted!!!!');
    // console.log(doc);
    if(doc)
    {
        await Review.deleteMany({
            _id:{
                $in:doc.reviews  // inrder to delete all reviews corresponding to perticular campground
            }
        })
    }
})
module.exports=mongoose.model('Campground',CampgroundSchema);