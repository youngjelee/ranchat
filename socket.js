const { v4: uuidv4 } = require('uuid');

// 소켓 모듈화

module.exports = function(io){
  
  const clients =  []; //방문자 정보를 담을 배열

//소캣 연결시
io.on('connection', function(socket){ 

  //고객정보 구성
  //id: socketId  roomName : 방제 , status : (w -대기, f-찾는중, c -매칭) 
  
  //방문자 정보 push                               
    clients.push({
        id : socket.id,
        socket : socket,
        roomName : "",
        status : "w"
      });
      // console.log(clients);
  //io.to(소켓아이디) 에게만   ///////////2 
  io.to(socket.id).emit('load name',socket.id);  
  
  socket.on('send message', function(name,text){   ////////////4
    var msg = text;
    console.log(name);
    console.log(text);
    io.emit('receive message', name,text); ///////////5
  });
  
  socket.on('randomChatBtnClick',(data)=>{
    for(var i =0 ; i<clients.length ; i++){
      if(clients[i].id == data.id){
        clients[i].status='f';
      }
    }
  });


  socket.on('randomChatFind',(data)=>{

    //상대 찾기
    var uuid =uuidv4();  
    for ( var i = 0 ; i<clients.length; i++){
      if(clients[i].status === 'f'){
        if(clients[i].id == data.id){
            continue;}
        clients[i].status = 'c';
        clients[i].roomName = uuid;
        clients[i].socket.join(uuid);//해당 소켓 uuid 방이동
        console.log(" 방이동1");
        for(var i =0 ; i<clients.length ; i++){
          if(clients[i].id == data.id){
            clients[i].status='c';
            clients[i].roomName= uuid;
            clients[i].socket.join(uuid);//해당 소켓 uuid 방이동
            io.sockets.to(uuid).emit("matchingComplete");
            console.log("방이동2");
            return;
          }
        }
      }
    }
  });

  //소켓 disconnect 
  socket.on('disconnect', function(){ 
    console.log('user disconnected: ', socket.id);
    for(var i =0 ; i<clients.length ; i++){
      if(clients[i].id == socket.id){
        clients.splice(i,1);
      }
    }
    // console.log(clients);
    // console.log(clients.length);
  });
});

}