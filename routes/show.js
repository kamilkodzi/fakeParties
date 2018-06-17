const   express     = require('express'),
        app         = express(),
        router      = express.Router(),
        middleware  = require('../middleware'),
        Event       = require('../models/event'),
        Category    = require('../models/category');
        
const NodeGeocoder = require('node-geocoder');
 
const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
const geocoder = NodeGeocoder(options);        
        
app.get("",function(req,res,callback){
    Category.find({},(err,foundCategories)=>{
        const   searchName          = (req.query.event)?req.query.event:"",
                searchLocalisation  = (req.query.location)?req.query.location:"",
                searchKM            = (req.query.kmNumber)?req.query.kmNumber:"",
                reName              = new RegExp(searchName,"ig");

            if((searchKM.length*searchLocalisation.length)>0){
                // full search 
                geocoder.geocode(searchLocalisation, function (err, data) {
                    Event.
                      find({}).
                        or([{category:reName},{name:reName}]).
                        where({geometry:{
                          $nearSphere: {
                             $geometry: {
                                type : "Point",
                                coordinates : [data[0].longitude, data[0].latitude]},
                             $minDistance: 0,
                             $maxDistance: 0+searchKM*1000
                          }}}).
                        sort('dateFrom').
                    exec((err,foundEvents)=>{
                        if(err || !foundEvents){
                            req.flash('error','Event not found');
                            res.redirect('back');
                        }else{
                            res.render('events/index',{events:foundEvents,category:foundCategories,field1:searchName,field2:searchLocalisation,field3:searchKM});
                        }
                    }); 
                });
            }else if(searchLocalisation.length>0){
                // Search by localisation and name/categry
                geocoder.geocode(searchLocalisation, function (err, data) {
                    const reCity = new RegExp(data[0].city,"ig");
                    Event.
                          find({}).
                            or([{category:reName},{name:reName}]).
                            where({locationCity:reCity}).
                            sort('dateFrom').
                        exec((err,foundEvents)=>{
                            if(err || !foundEvents){
                                req.flash('error','Event not found');
                                res.redirect('back');
                            }else{
                                res.render('events/index',{events:foundEvents,category:foundCategories,field1:searchName,field2:searchLocalisation,field3:searchKM});
                            }
                    }); 
                });
            }else{
                // Search by name or name/category
                   Event.
                      find({}).
                        or([{category:reName},{name:reName}]).
                        sort('dateFrom').
                    exec((err,foundEvents)=>{
                        if(err || !foundEvents){
                            req.flash('error','Event not found');
                            res.redirect('back');
                        }else{
                            res.render('events/index',{events:foundEvents,category:foundCategories,field1:searchName,field2:searchLocalisation,field3:searchKM});
                        }
                    });
            }
        });    
});       
    
module.exports=app;