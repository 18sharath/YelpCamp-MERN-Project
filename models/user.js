const mongoose=require('mongoose');

const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');


const UserSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});

UserSchema.plugin(passportLocalMongoose); // it is just adding a some content into usershema

module.exports=mongoose.model('User',UserSchema);

