const mongoose=require('mongoose');

const CategorySchema= new mongoose.Schema({
      categoryName:    String,
      imgUrl:String,
      somethingAbout: String
});

module.exports=mongoose.model("Category",CategorySchema);