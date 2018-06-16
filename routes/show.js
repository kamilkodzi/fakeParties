const   express     = require('express'),
        app         = express(),
        router      = express.Router(),
        middleware  = require('../middleware'),
        Event       = require('../models/event'),
        Category    = require('../models/category');
        
        
        
app.get("",function(req,res,callback){
    const   searchName          = req.query.event,
            searchLocalisation  = req.query.location,
            searchDate          = req.query.date;
    Category.find({},(err,foundCategories)=>{
        const re = new RegExp(searchName,"ig");
        Event.
          find({}).
          or([{category:re},{name:re}]).
        //   where(near())
        //   where('category', re).
        //   where('category').equals( searchName ).
        //   where('age').gt(17).lt(66).
        //   where('likes').in(['vaporizing', 'talking']).
        //   limit(10).
        //   sort('-occupation').
        //   select('name occupation').
        exec((err,foundEvents)=>{
            if(err || !foundEvents){
                req.flash('error','Event not found');
                res.redirect('back');
            }else{
                res.render('events/index',{events:foundEvents,category:foundCategories,field1:searchName,field2:searchLocalisation,field3:searchDate});
            }
        }); 
    });
});         
        


module.exports=app;