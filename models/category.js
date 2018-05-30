const mongoose=require('mongoose');

const CategorySchema= new mongoose.Schema({
      cathegoryName:    String,
});

module.exports=mongoose.model("Category",CategorySchema);