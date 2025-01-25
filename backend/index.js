const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });
const GameData = require('./gamedata.js');

// Game data
// TODO: extract this to a database eventually
const gameData = new GameData();

io.on('connection', (socket) => {

    console.log('USER CONNECTED: ' + socket.id);

    socket.on('hello', (count) => {
        console.log(count + 1);
    });

    // Create the game and emit back the game code once it is done
    socket.on('createGame', (cityName) => {
        try {
            gameData.createGame(cityName).then((gameCode) => {
                console.log('GAME CREATED: code = ' + gameCode + ', city = ' + cityName);
                socket.emit('gameCreated', gameCode);
            });
        } catch (err) {
            socket.emit('errorGameCreated');
        }
    });
  });
  
server.listen(3000, () => {
    console.log('listening on *:3000');
});
