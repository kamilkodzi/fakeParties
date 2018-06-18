var mongoose = require('mongoose');
var Category =require('./models/category');

var data = [{categoryName:'Music',imgUrl:'img/category/music.jpg',somethingAbout:"Intimate house concerts, major music festivals, and the occasional dance party"},
            {categoryName:'Festival',imgUrl:'img/category/festival.jpg',somethingAbout:"Casual happy hours, singles nights, and all-night celebrations"},
            {categoryName:'Garden',imgUrl:'img/category/garden.jpg',somethingAbout:"Time with mother nature, chillout, friends-time"},
            {categoryName:'Food',imgUrl:'img/category/food.jpg',somethingAbout:"Dinner parties, tastings, and big-time festivals"},
            {categoryName:'Planet',imgUrl:'img/category/animal.jpg',somethingAbout:"Find all the wonders of the world in one place"}];



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