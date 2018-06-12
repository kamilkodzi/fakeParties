const mongoose=require('mongoose');

const EventSchema= new mongoose.Schema({
      name: String,
      description:String,
      organizer: String,
      location: String,
      startDay:{type:Date},
      endDay:{type:Date},
      image: String,
      cathegory: String,
      price:String,
      createdAt:{type:Date,default:Date.now},
      author: {
        id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"            
        },
        username: String
      },
      comments:[
         {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Comment"
         }
      ]
});

module.exports=mongoose.model("Event",EventSchema);