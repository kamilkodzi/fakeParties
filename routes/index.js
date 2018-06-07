const   express     = require('express'),
        router      = express.Router(),
        Events      = require('../models/event');

router.get('/',function(req,res){
  Events.find({},function(err,topEvents){
    if(err){
        console.log(err);
    } else{
          res.render("index",{events:topEvents});
    }
  });   
});

router.get('/login',function(req,res){
  res.render('login');
});

router.get('/register',function(req,res){
  res.render('register');
});

module.exports=router;

