const   express     = require('express'),
        router      = express.Router(),
        middleware  = require('../middleware'),
        Event       = require('../models/event'),
        Category    = require('../models/category');
        
router.get('/:id',(req,res)=>{
  Event.find({category:req.params.id},(err,foundEvents)=>{
    if(err){
        res.render('login');
    } else{
        res.render('events/index',{events:foundEvents});
    }
  }).sort({_id:-1});
});



module.exports=router;