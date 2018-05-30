const mongoose=require('mongoose');

const UserSchema= new mongoose.Schema({
    username: String,
    password: String,
    avatar: String,
    firstName: String,
    lastName: String,
    email: String,
    isAdmin:{type: Boolean, default:false}
});

module.exports=mongoose.model("User",UserSchema);