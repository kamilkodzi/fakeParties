const mongoose=require('mongoose');

const EventSchema= new mongoose.Schema({
      name: String,
      description:String,
      location: String,
      lat:Number,
      lng:Number,
      dateFrom:{type:Date},
      dateTo:{type:Date},
      image: String,
      createdAt:{type:Date,default:Date.now},
      category:{
        id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category"},categoryName:String},
      author: {
        id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"},username: String}
});

module.exports=mongoose.model("Event",EventSchema);