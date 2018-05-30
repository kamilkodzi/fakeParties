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
});

module.exports=mongoose.model("Event",EventSchema);