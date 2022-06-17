var express = require('express');

var app = express();

app.use(express.static(__dirname));

const http = require('http');

var io = require('socket.io')(http);

var mongoose = require('mongoose');

var dbUrl = 'mongodb+srv://olehsau:65138@cluster0.lie2rmp.mongodb.net/test'

var Message = mongoose.model('Message', {name : String, message : String})

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))



mongoose.connect(dbUrl , (err) => { 
    console.log('mongodb connected');
    if(err!=null){console.log('error! ',err);}
 })

app.get('/messages', (req,res)=>{
    Message.find({}, (err,messages)=>{
        res.send(messages);
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
      if(err)
        sendStatus(500);
      io.emit('message',req.body);
      res.sendStatus(200);
    })
  })


  io.on('connection', () =>{
    console.log('a user is connected')
  })
  

var server = app.listen(3005, () => {
    console.log('server is running on port', server.address().port);
});