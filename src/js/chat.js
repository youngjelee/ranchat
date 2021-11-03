"use strict";

const socket = io();

const nickname = document.querySelector("#nickname");
const chattingList = document.querySelector(".chatting-list");
const chattingInput = document.querySelector(".chatting-input");
const sendButton = document.querySelector(".send-button");

sendButton.addEventListener('click',()=>{

    const param = {
        name : nickname.value,
        msg : chattingInput.value
    }

    socket.emit("chatting",param);
});


socket.on("chatting", (data)=>{
    // const li = document.createElement("li");
    // li.innerText =`${data.name}님 :  ${data.msg}`;
    // chattingList.appendChild(li);
    const {name,msg,time} = data;
    const item= new LiModel(name,msg,time);
    item.makeLi();
});

function LiModel(name,msg, time){
    this.name = name;
    this.msg = msg;
    this.time  = time;

    this.makeLi = () => {
        const li = document.createElement("li");
        const dom = `${this.name} - ${this.msg} -${this.time}`;
        li.innerHTML = dom;
        chattingList.appendChild(li);
    }
}