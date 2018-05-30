const express = require('express')
const app = express()
 
app.get('/', function (req, res) {
  res.send('Hello World')
})
 
app.listen(process.env.PORT,process.env.IP,function(){
    console.log('fakeServer has started')
})