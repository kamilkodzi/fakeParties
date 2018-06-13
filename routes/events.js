const   express     = require('express'),
        router      = express.Router(),
        middleware  = require('../middleware'),
        Event       = require('../models/event'),
        Category    = require('../models/category');

router.get('/',(req,res)=>{
  Event.find({},(err,foundEvents)=>{
    if(err){
        res.render('login');
    } else{
        res.render('events/index',{events:foundEvents});
    }
  }).sort({_id:-1});
});

// New
router.get('/new',middleware.isLoggedIn,(req,res)=>{
    Category.find({},(err,foundCategories)=>{
       if(err){
         res.render('/');
       }else{
         res.render('events/new',{categories:foundCategories,geoip:req.geoip}); 
       }
    });
    
});

// Show
router.get('/:id',(req,res)=>{
    Event.findById(req.params.id).exec((err,foundEvent)=>{
        if(err || !foundEvent){
            req.flash('error','Event not found');
            res.redirect('back');
        }else{
            res.render('events/show',{event:foundEvent});
        }
    });
});

// Edit
router.get('/:id/edit',middleware.checkEventOwnership,(req,res)=>{
        Event.findById(req.params.id,(err,foundEvent)=>{
            if(err){
                req.redirect('/');
            }else{
             res.render('events/edit',{event:foundEvent});   
            }
        });
});

// Create
router.post('/', middleware.isLoggedIn,(req,res)=>{
    Category.findById(req.body.category,(err,foundCategory)=>{
            const  
            name        = req.body.name,
            location    = req.body.location,
            image       = req.body.image,
            desc        = req.body.description,
            dateFrom    = req.body.dateFrom,
            dateTo      = req.body.dateTo,
            category={
                id:req.body.category,
                categoryName: foundCategory.categoryName},
            author={
                id: req.user._id,
                username:req.user.username};

    const newEvent={name: name, image:image,description:desc, author:author, locaton:location,category:category,dateFrom:dateFrom,dateTo:dateTo};
        Event.create(newEvent,(err,newlyCreated)=>{
           if(err){
               res.redirect('/');
           } else{
              res.redirect('/events/'+newlyCreated.id); 
           }
        });
    });
});

// Update
router.put('/:id',(req,res)=>{
    Event.findByIdAndUpdate(req.params.id,req.body.event,(err,updatedEvent)=>{
      if(err){
          res.redirect('/');
      }else{
          res.redirect('/events/'+req.params.id);
      }
    });
});

// Destroy
router.delete('/:id',middleware.checkEventOwnership,(req,res)=>{
    Event.findByIdAndRemove(req.params.id,(err)=>{
      if(err){
          res.redirect('/');
      } else{
          res.redirect('/');
      }
    });
});

module.exports=router;