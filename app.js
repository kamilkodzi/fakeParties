require('dotenv').config();
const   express                 =require('express'),
        app                     =express(),
        mongoose                =require('mongoose'),
        User                    =require('./models/user'),
        Event                   =require('./models/event'),
        Category                =require('./models/category'),
        passport                =require('passport'),
        LocalStrategy           =require('passport-local'),
        passportLocalMongoose   =require('passport-local-mongoose'),
        methodOverride          =require('method-override'),
        bodyParser              =require('body-parser'),
        flash                   =require('connect-flash-plus'),
        session                 =require('express-session'),
        moment                  =require('moment'),
        seedDB                  =require('./seed.js'),
        cloudinary              =require('cloudinary').v2;
        
const   indexRoutes             =require('./routes/index'),
        eventsRoutes            =require('./routes/events'),
        searchRoutes            =require('./routes/show');

const   url=process.env.DATABASEURL || 'mongodb://localhost/fake';

mongoose.connect(url);

app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// seedDB();

//PASSPORT CONFIGURATION
app.use(session({ 
    secret: 'kamilkodzisecret', 
    resave: false, 
    saveUninitialized: false ,
    cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 }
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
app.use(function(req,res,next){
    res.locals.moment=moment;
    res.locals.cloudinary = cloudinary;
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

 
app.use(indexRoutes);
app.use("/show",searchRoutes);
app.use("/events" ,eventsRoutes);
 
app.listen(process.env.PORT||3000,process.env.IP,function(){
    console.log('fakeServer has started');
});