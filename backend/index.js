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
// User data
// socket id: { gameCode: string, selectedChar: number } | undefined
const users = {};

io.on('connection', (socket) => {

    console.log('USER CONNECTED: ' + socket.id);
    // Add the user
    users[socket.id] = undefined;

    // Let a user join a game of a code with info
    socket.on('joinGame', (data) => {
        console.log('USER JOINED ROOM: code = ' + data.gameCode + ', char = ' + data.selectedChar + ', id = ' + socket.id);
        try {
            users[socket.id] = { gameCode: data.gameCode.toUpperCase(), selectedChar: data.selectedChar };
        } catch (err) {
            console.log("ERROR: user cannot join room, data = " + JSON.stringify(data));
        }
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

// Every second, update the games
setInterval(() => {
    console.log("  (Updating games)");
    gameData.updateGamesByOneSecond();
    // TODO: let the sockets know, if they're connected
    for (const [userId, value] of Object.entries(users)) {
        if (value === undefined) {
            continue;
        }
        console.log("    (Updating game for user): id = " + userId + ", code = " + value.gameCode);
        try {
            let thisGame = gameData.getGame(value.gameCode)
            io.to(userId).emit("updateGame", thisGame);
        } catch (err) {
            // Could not find the game; it's probably gone
            console.log("ERR: could not get game for user: id = " + userId + ", code = " + value.gameCode);
            console.log(err);
            continue;
        }
    }
}, 1000);
  
server.listen(3000, () => {
    console.log('listening on *:3000');
});
