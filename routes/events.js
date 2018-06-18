const   express     = require('express'),
        router      = express.Router(),
        middleware  = require('../middleware'),
        Event       = require('../models/event'),
        Category    = require('../models/category'),
        multer      = require('multer'),
        cloudinary  = require('cloudinary'),
        NodeGeocoder= require('node-geocoder'),
        fs          = require('fs');
        
const   options = {
        provider: 'google',
        httpAdapter: 'https',
        apiKey: process.env.GEOCODER_API_KEY,
        formatter: null},
        geocoder = NodeGeocoder(options);

const   imageFilter = function (req, file, cb) {
        // accept image files only
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|jfif)$/i)) {
                req.fileValidationError = 'Please add jpg,jpeg,png,gif file';
                return cb(new Error('Only image files are allowed!'), false);
            }
        cb(null, true)},
        
        storage = multer.diskStorage({
          filename: function(req, file, callback) {
            callback(null, Date.now() + file.originalname);
          }
        }),
        
        upload = multer({storage: storage, fileFilter: imageFilter});

// router.get('/',(req,res)=>{
//   Event.find({},(err,foundEvents)=>{
//     if(err){
//         res.render('login');
//     } else{
//         res.render('events/index',{events:foundEvents,field1:'',field2:'',field3:''});
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

// Create new Event
router.post('/', middleware.isLoggedIn,upload.single('image'),(req,res,err)=>{
  
    Category.findById(req.body.category,(err,foundCategory)=>{
        const   name        = req.body.name,
                desc        = req.body.description,
                dateFrom    = req.body.dateFrom,
                dateTo      = req.body.dateTo,
                category    = foundCategory.categoryName,
                author={
                    id: req.user._id,
                    username:req.user.username};
            
        geocoder.geocode(req.body.location,(err, data)=> {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }        
            const geometry= {
                  type: 'Point',
                  coordinates: [data[0].longitude, data[0].latitude]},
                  location  = data[0].formattedAddress,
                  locationCity=data[0].city;
                  
            cloudinary.uploader.upload(req.file.path,(result)=> {
            const   image       = result.secure_url,
                    cloudId     = result.public_id;
            const   newEvent    ={name: name,
                                  image:image,
                                  cloudId:cloudId,
                                  description:desc, 
                                  author:author,
                                  locationCity:locationCity, 
                                  location:location,
                                  geometry:geometry,
                                  category:category,
                                  dateFrom:dateFrom,
                                  dateTo:dateTo};
                                  
                Event.create(newEvent,(err,newlyCreated)=>{
                    if(err){
                        res.redirect('/');
                    }else{
                        fs.unlinkSync(req.file.path);
                        res.redirect('/events/'+newlyCreated.id); 
                    }
                });    
            });  
        });
    });
    
    
});


// Update event
router.put("/:id", middleware.checkEventOwnership,upload.single('image'), function(req, res){
    Event.findById(req.params.id,(err,foundEvent)=>{
    if(err){
        req.flash('error',err.message);
        return res.redirect('back')}    
    
          geocoder.geocode(req.body.location, function (err, data) {
            if (err || !data.length) {
              req.flash('error', 'Invalid address');
              return res.redirect('back');
            }
            foundEvent.locationCity=data[0].city;
            foundEvent.geometry= {
                type: 'Point',
                coordinates: [data[0].longitude, data[0].latitude]},
            foundEvent.location = data[0].formattedAddress;
        
        
            if(req.file){
                console.log(foundEvent.cloudId);
                cloudinary.v2.uploader.destroy(foundEvent.cloudId,(err)=>{
                    if(err){
                    req.flash('error',err.message);
                    return res.redirect('back')}   
                        cloudinary.v2.uploader.upload(req.file.path,(err,result)=>{
                            if(err){
                            req.flash('error',err.message);
                            return res.redirect('back')}    
                            
                            foundEvent.image=result.secure_url;
                            foundEvent.cloudId=result.public_id;
                            foundEvent.dateFrom=req.body.event.dateFrom;
                            foundEvent.dateTo=req.body.event.dateTo;
                            
                            foundEvent.name=req.body.event.name;
                            foundEvent.description=req.body.event.description;
                            foundEvent.category=req.body.category;
                            foundEvent.save();
                            req.flash("success","Successfully Updated!");
                            res.redirect("/events/" + foundEvent._id);
                        });
                });
            }
          });
    });
});

// Destroy
router.delete('/:id',middleware.checkEventOwnership,(req,res)=>{
    Event.findById(req.params.id,(err,foundEvent)=>{
     if(err){
        req.flash('error',err.message);
        return res.redirect('back')}   
    try{
       cloudinary.v2.uploader.destroy(foundEvent.cloudId,()=>{
          foundEvent.remove();
          req.flash("success","Event deleted successfully!");
          res.redirect("/"); 
       });
    }catch(err){
       req.flash('error',err.message);
       return res.redirect('back');  
    }
    });
});

module.exports=router;