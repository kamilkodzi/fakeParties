const   express     = require('express'),
        router      = express.Router(),
        passport    = require('passport'),
        Events      = require('../models/event'),
        User        = require('../models/user');

// Show main index page
router.get('/',(req,res)=>{
  Events.find({},(err,topEvents)=>{
    if(err){
        res.render('login');
    } else{
        res.render("index",{events:topEvents});
    }
  }).sort({_id:1}).limit(6);
});

// Show login form
router.get('/login',(req,res)=>{
  res.render('login');
});

// Show logout form
router.get('/register',(req,res)=>{
  res.render('register');
});

// Create new user
router.post("/register",(req,res,next)=>{
 const newUser= new User(
  {
      username: req.body.username,
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      email:req.body.email
  });
  User.register(newUser,req.body.password,(err,user)=>{
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

// Log in to application
router.post("/login",passport.authenticate("local",
  {
      successRedirect:"/",
      failureRedirect:"/login",
      failureFlash : true
  }),(req,res,next)=>{
    req.session.save((err) => {
      if (err) {
          return next(err);
      }
      res.redirect('/');
    });
});

// Logout from application
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

// Show user page
router.get("/users/:id",(req,res)=>{
    User.findById(req.params.id,(err,foundUser)=>{
        if(err || !foundUser){
            req.flash("error","No user found");
            res.redirect("/");
        }else{
            Events.find().where("author.id").equals(foundUser._id).exec((err,events)=>{
                if(err){
                    req.flash("error","No user found");
                    res.redirect("back");
                }else{
                    res.render("users/show",{user:foundUser, events:events});
                }   
            });
        }
    });
});

module.exports=router;