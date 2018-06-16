var mongoose = require('mongoose');
var Category =require('./models/category');

var data = [{categoryName:'Music',imgUrl:'img/category/music.jpg'},
            {categoryName:'Festival',imgUrl:'img/category/festival.jpg'},
            {categoryName:'Garden Parties',imgUrl:'img/category/garden.jpg'},
            {categoryName:'Food & Drink',imgUrl:'img/category/food.jpg'},
            {categoryName:'Networking',imgUrl:'img/category/networking.jpg'}];



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