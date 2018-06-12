const   express     = require('express'),
        router      = express.Router(),
        Events      = require('../models/event');

router.get('/',function(req,res){
    res.render('events/index');
});

// SHOW - shows more info about one campgrounds
router.get("/:id",function(req,res){
    Events.findById(req.params.id).exec(function(err,foundEvent){
        if(err || !foundEvent){
            req.flash("error","Event not found");
            res.redirect("back");
        }else{
            res.render("events/show",{event:foundEvent});
        }
    });
});


module.exports=router;

