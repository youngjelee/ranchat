// server.js

var express = require('express');
var app = express();
var http = require('http').Server(app); //1
var io = require('socket.io')(http);    //1

app.get('/',function(req, res){  //2
  res.sendFile(__dirname + '/src/index.html');
  console.log(__dirname);
});

var clients =  new Map();

io.on('connection', function(socket){ //3
  //클라이언트 정보 설정 id: 소켓아이디 , 
  //roomName :  방제목, 
  //status : w대기 , f찾는중 , c매칭 
  clients.set(socket.id,{
      roomName : "",
      status : 'w'
    });

  io.to(socket.id).emit('load name',socket.id);   //3-1

  socket.on('disconnect', function(){ //3-2
    console.log('user disconnected: ', socket.id);
  });

  socket.on('send message', function(name,text){ //3-3
    var msg = text;
    console.log(name);
    console.log(text);
    // console.log("1",name);
    io.emit('receive message', name,text);
  });
  
  socket.on('randomChatFind',(data)=>{
    
    console.log(clients);
    console.log(clients.get(data.id));
    console.log(clients[data.id].set('staus',"f"));

    console.log(clients);
    //사용자 찾기
      for ( var i = 0 ; i<clients.length; i++){
    }
  });
});

http.listen(3000, function(){ //4
  console.log('server on!');
});