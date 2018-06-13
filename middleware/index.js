const   Event           = require("../models/event"),
        middlewareObj   = {};

middlewareObj.isLoggedIn=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that");
    res.redirect("/login");
};

middlewareObj.checkEventOwnership = (req,res,next)=>{
    if(req.isAuthenticated()){
        Event.findById(req.params.id,(err,foundEvent)=>{
            if(err || !foundEvent){
                req.flash("error","Event not found");
                res.redirect("back");
            }else{
                if(foundEvent.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }else{
                    req.flash("error","You don`t have premissin to do that");
                    res.redirect("back");
                }
            }
        }); 
    }else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
};

module.exports=middlewareObj;