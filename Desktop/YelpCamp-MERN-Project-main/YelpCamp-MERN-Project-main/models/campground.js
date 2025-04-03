const { required, func } = require('joi');
const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require('./reviews')
const User=require('./user');
const { coordinates } = require('@maptiler/client');

const opts = { toJSON: { virtuals: true } }; // inorder to create short description
const Imageschema=new Schema({
    
        Url:String,
        filename:String
});
// to  get a small size photo in edit page
Imageschema.virtual('thumbnail').get(function(){
    return this.Url.replace('/upload','/upload/w_200'); // w_200 is the size 
});

const CampgroundSchema=new Schema({
    title:String,
    images:[Imageschema],
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    price:Number,
    description:String,
    location:String,    
    author:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
},opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
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