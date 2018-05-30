const   express     =   require('express'),
        app         =   express(),
        mongoose    =   require('mongoose'),
        User        =   require('./models/user.js'),
        Event       =   require('./models/event.js'),
        Categhory   =   require('./models/categhory.js');
 
app.get('/', function (req, res) {
  res.send('Hello World');
});
 
app.listen(process.env.PORT,process.env.IP,function(){
    console.log('fakeServer has started');
});