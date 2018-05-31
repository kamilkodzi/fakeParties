const   express     = require('express'),
        router      = express.Router(),
        Events      = require('../models/event');

router.get('/',function(req,res){
  res.render('index');
});

module.exports=router;