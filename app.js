const   express     =   require('express'),
        app         =   express(),
        mongoose    =   require('mongoose'),
        User        =   require('./models/user.js'),
        Event       =   require('./models/event.js'),
        Category   =   require('./models/category.js');
 
mongoose.connect('mongodb://localhost/fake1');
 
// Event.create({
//         name: 'Urodziny Kamila',
//         description:'Niezapomniana impreza urodzinowa na rodzinnych ogrodkach działkowych',
//         organizer: 'Kamil A',
//         location: 'Gliwice',
//         startDay:new Date(2018, 06, 10),
//         endDay:new Date(2018, 06, 11),
//         image: 'https://images.unsplash.com/photo-1493151920995-56c5a400e6d0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=894ecbdb65911e692a58d962e92b071a&auto=format&fit=crop&w=1650&q=80',
//         cathegory: 'Zabawy',
// });

 
app.get('/', function (req, res) {
  res.send('Hello World');
});
 
app.listen(process.env.PORT,process.env.IP,function(){
    console.log('fakeServer has started');
});