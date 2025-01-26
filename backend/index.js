const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const Player = require('./player');
const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });
const GameData = require('./gamedata');

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
            users[socket.id] = new Player(socket.id, data.playerName, data.selectedChar, data.gameCode.toUpperCase());
        } catch (err) {
            console.log("ERROR: user cannot join room, data = " + JSON.stringify(data));
            socket.emit('errorJoining');
        }
    });

    // Create the game and emit back the game code once it is done
    socket.on('createGame', (cityName) => {
        try {
            gameData.createGame(cityName).then((gameCode) => {
                console.log('GAME CREATED: code = ' + gameCode + ', city = ' + cityName);
                socket.emit('gameCreated', gameCode);
            }).catch(err=>socket.emit('errorGameCreated'));
        } catch (err) {
            socket.emit('errorGameCreated');
        }
    });

    // Check a code is valid before joining
    socket.on('checkValidCode', (gameCode) => {
        if (gameData.doesGameCodeExist(gameCode.toUpperCase())) {
            socket.emit('successJoining');
        } else {
            socket.emit('errorJoining');
        }
    });

    // Someone can guess a name
    socket.on('guessName', (theName) => {
        gameData.guess(theName, users[socket.id], getPlayersInRoom(users[socket.id].gameCode).length);
    });

    socket.on('disconnect',()=>{
        console.log(socket.id + " disconected")
        delete users[socket.id];
    })
  });

// Get all players in a room, emitted back in the format
// { id, rk (rank), name, char, score }
const formatAndReturnAllPlayersInRoom = (gameCode) => {
    const returned = getPlayersInRoom(gameCode);
    let res = [];
    for (let i = 0; i < returned.length; i++) {
        res.push({
            id: returned[i].id,
            rk: (i + 1),
            name: returned[i].name,
            char: returned[i].selectedChar,
            score: returned[i].points
        });
    }
    console.log("RES: " + JSON.stringify(res));
    return res;
}


// Every second, update the games
setInterval(() => {
    gameData.updateGamesByOneSecond();
    // Let the sockets know, if they're connected
    for (const [userId, value] of Object.entries(users)) {
        if (value === undefined) {
            continue;
        }
        console.log("    (Updating game for user): id = " + userId + ", code = " + value.gameCode);
        //try {
            let thisGame = gameData.getGame(value.gameCode)
            io.to(userId).emit("updateGame", thisGame);
            let theseUsers = formatAndReturnAllPlayersInRoom(value.gameCode);
            console.log(JSON.stringify(theseUsers));
            io.to(userId).emit('returnPlayers', theseUsers);
        //} catch (err) {
            // Could not find the game; it's probably gone
            //console.log("ERR: could not get game for user: id = " + userId + ", code = " + value.gameCode);
            //console.log(err);
            //continue;
        //}
    }
}, 1000);

function getPlayersInRoom(roomCode){
    let output = [];
    for (const [key, value] of Object.entries(users)){
        console.log(JSON.stringify(key));
        console.log(value);
        if (value === undefined) continue;
        if(value.gameCode == roomCode){
            output.push(value);
        }
    }
    console.log("OUT: " + JSON.stringify(output));
    return output;
}
  
server.listen(3000, () => {
    console.log('listening on *:3000');
});
