const   express     = require('express'),
        router      = express.Router(),
        passport    = require('passport'),
        Events      = require('../models/event'),
        User        = require('../models/user');

// Main page
router.get('/',function(req,res){
  Events.find({},function(err,topEvents){
    if(err){
        res.render('login');
    } else{
          res.render("index",{events:topEvents});
    }
  }).sort({_id:1}).limit(6);
});

router.get('/login',function(req,res){
  res.render('login');
});

router.get('/register',function(req,res){
  res.render('register');
});


// Create new user
router.post("/register",function(req,res,next){
  
 const newUser= new User(
  {
      username: req.body.username,
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      email:req.body.email
  });
  
  User.register( newUser,req.body.password,(err,user)=>{
    if(err){
      req.flash("error",err.message);
      return res.redirect("/register");
    }else{
      passport.authenticate('local')(req,res,()=>{
        req.session.save((err) => {
            if (err) {
              return next(err);
            }
        req.flash('success','Wellcone to FineParties '+ user.username);
        res.redirect('/');
        });
      });
    }
  });
});

router.post("/login",passport.authenticate("local",
  {
      successRedirect:"/",
      failureRedirect:"/login",
      failureFlash : true
  }), function(req,res,next){
    req.session.save((err) => {
      if (err) {
          return next(err);
      }
      res.redirect('/');
    });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success","Logged you out!");
        res.redirect('/');
    });
});



module.exports=router;

