const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const streets = require('./streets');
//streets.getStreets('Boston').then((res)=>console.log(res));
const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('hello',(count)=>{
        console.log(count + 1);
    })
  });
  
server.listen(3000, () => {
    console.log('listening on *:3000');
});