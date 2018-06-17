const mongoose=require('mongoose');

const EventSchema= new mongoose.Schema({
      name: String,
      description:String,
      location: String,
      locationCity:String,
      geometry:  {
        type: {type: String, default: 'Point',index: true},
        coordinates: {type: [Number], default: [0, 0],index: '2dsphere'}
      },
      dateFrom:{type:Date},
      dateTo:{type:Date},
      image: String,
      cloudId:String,
      createdAt:{type:Date,default:Date.now},
      category:String,
      author: {
        id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"},username: String}
});

module.exports=mongoose.model("Event",EventSchema);