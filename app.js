// server.js

var express = require('express');
var app = express();
var http = require('http').Server(app); //1
var io = require('socket.io')(http);    //1

require('./socket.js')(io);

app.get('/',function(req, res){  //2
  res.sendFile(__dirname + '/src/index.html');
  console.log(__dirname);
});

http.listen(3000, function(){ //4
  console.log(' 3000 port server on!');
});
