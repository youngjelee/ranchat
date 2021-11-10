const { v4: uuidv4 } = require('uuid');

// 소켓 모듈화

module.exports = function(io){
  
  const clients =  []; //방문자 정보를 담을 배열

//소캣 연결시
io.on('connection', function(socket){ 
  // //고객정보 구성 id: socketId  roomName : 방제 , status : (w -대기, f-찾는중, c -매칭) 
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
  
  socket.on('send message', function(data){   ////////////4
    io.sockets.to(data.roomName).emit('receive message', data.name,data.text); ///////////5
  });
  
  socket.on('randomChatBtnClick',(data)=>{
    for(var i =0 ; i<clients.length ; i++){
      if(clients[i].id == data.id){
        clients[i].status='f';
      }
    }
  });

  socket.on('randomChatQuitClick',(data)=>{
    io.sockets.to(data.roomName).emit("end chat");
    // console.log("12ddddddddddd3",roomName);
    for(var i =0 ; i<clients.length ; i++){
        if(clients[i].roomName == data.roomName){
            clients[i].status="w";
            clients[i].roomName="";
            clients[i].socket.leave(data.roomName);
        }
        for(var j= 0 ; j<clients.length; j++){
          if(clients[j].roomName == data.roomName){
            clients[j].status="w";
            clients[j].roomName="";
            clients[j].socket.leave(data.roomName);
        }
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
        for(var j =0 ; j<clients.length ; j++){
          if(clients[j].id == data.id){
            clients[j].status='c';
            clients[j].roomName= uuid;
            clients[j].socket.join(uuid);//해당 소켓 uuid 방이동
            io.sockets.to(uuid).emit("matchingComplete",{roomName:uuid});
            console.log("방이동2");
            return;
          }
        }
      }
    }
  });
  //방문자 카운팅
  socket.on("clientsCount",()=>{
    io.sockets.emit("clientsCnt",clients.length);
  });

  //소켓 disconnect 
  
  socket.on('disconnect', ()=>{ 
    for(var i =0 ; i<clients.length ; i++){
      if(clients[i].id == socket.id){
        if(clients[i].status== 'c'){
          for(var j= 0 ; j<clients.length; j++){
              if(clients[j].roomName==clients[i].roomName){
                io.sockets.to(clients[i].roomName).emit("end chat");
                clients[j].status="w";
                clients[j].roomName="";
                clients[j].socket.leave(clients[i].roomName);
                
              }

            }
       }
        clients.splice(i,1);
      }
    }

    console.log(clients);
    console.log("===================================");
    // console.log(clients.length);
  });
});


}