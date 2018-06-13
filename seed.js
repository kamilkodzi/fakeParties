var mongoose = require('mongoose');
var Category =require('./models/category');

var data = [{categoryName:'Music'},{categoryName:'Festival'},{categoryName:'Garden Parties'},{categoryName:'Food & Drink'},{categoryName:'Sport & Wellnes'},];



function seedDB(){
    data.forEach((seed)=>{
        Category.create(seed,(err,category)=>{
        if(err){
            console.log(err);
        }else{
            console.log("added Category");
        }
        });
    });
}
            

module.exports = seedDB;