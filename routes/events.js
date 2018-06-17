const   express     = require('express'),
        router      = express.Router(),
        middleware  = require('../middleware'),
        Event       = require('../models/event'),
        Category    = require('../models/category'),
        multer      = require('multer'),
        cloudinary  = require('cloudinary'),
        NodeGeocoder= require('node-geocoder');
 
const   options = {
        provider: 'google',
        httpAdapter: 'https',
        apiKey: process.env.GEOCODER_API_KEY,
        formatter: null},
        geocoder = NodeGeocoder(options);

const   imageFilter = function (req, file, cb) {
        // accept image files only
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
                return cb(new Error('Only image files are allowed!'), false);
            }
        cb(null, true)},
        upload = multer({fileFilter: imageFilter});
        
        cloudinary.config({ 
        cloud_name: 'XXX',
        api_key: "XXX", 
        api_secret: "XXX"
        });


// router.get('/',(req,res)=>{
//   Event.find({},(err,foundEvents)=>{
//     if(err){
//         res.render('login');
//     } else{
//         res.render('events/index',{events:foundEvents});
//     }
//   }).sort({_id:-1});
// });

// New
router.get('/new',middleware.isLoggedIn,(req,res)=>{
    Category.find({},(err,foundCategories)=>{
       if(err){
         res.render('/');
       }else{
         res.render('events/new',{categories:foundCategories}); 
        //  geoip:req.geoip
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
    Category.find({},(err,foundCategories)=>{
        Event.findById(req.params.id,(err,foundEvent)=>{
            if(err){
                req.redirect('/');
            }else{
             res.render('events/edit',{event:foundEvent,categories:foundCategories});   
            }
        });        
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
            category    = foundCategory.categoryName,
            author={
                id: req.user._id,
                username:req.user.username};
        
        geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }        
            const geometry= {
                  type: 'Point',
                  coordinates: [data[0].longitude, data[0].latitude]},
                  location  = data[0].formattedAddress,
                  locationCity=data[0].city;
                  console.log(geometry);
            const newEvent={name: name, image:image,description:desc, author:author,locationCity:locationCity, location:location,geometry:geometry,category:category,dateFrom:dateFrom,dateTo:dateTo};
              
            Event.create(newEvent,(err,newlyCreated)=>{
                if(err){
                    res.redirect('/');
                }else{
                    res.redirect('/events/'+newlyCreated.id); 
                }
            });
        });
    });
});

// // Update
// router.put('/:id',(req,res)=>{
//     Event.findByIdAndUpdate(req.params.id,req.body.event,(err,updatedEvent)=>{
//       if(err){
//           res.redirect('/');
//       }else{
//           res.redirect('/events/'+req.params.id);
//       }
//     });
// });


// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkEventOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.event.locationCity=data[0].city;
    req.body.event.geometry= {
        type: 'Point',
        coordinates: [data[0].longitude, data[0].latitude]},
    req.body.event.location = data[0].formattedAddress;

    Event.findByIdAndUpdate(req.params.id, req.body.event, function(err, foundEvent){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/events/" + foundEvent._id);
        }
    });
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