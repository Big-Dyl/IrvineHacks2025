const streets = require('./streets');

const TOTAL_SECONDS_PER_ROUND = 20;

class GameData {
  constructor() {
    // Store the game data
    // Format reference:
    /*
    "ABCD": {
      allNames: [
        "Bob Avenue",
        "Alice Avenue",
        "E Peltason Drive"
      ],
      currentNameIndex: 0,
      currentSecondsLeft: 30,
      currentNamePortions: [] // The indices that have been revealed
    }
    */
    this.gameData = {};
  }

  generateCode() {
    // TODO: implement better
    let res = "";
    while (res.length === 0 || res in Object.keys(this.gameData)) {
      res = "";
      for (let i = 0; i < 4; i++) {
        res += String.fromCharCode("A".charCodeAt(0) + Math.floor(Math.random() * 26));
      }
    }
    // TODO: check for collisions
    return res;
  }

  async createGame(cityName) {
    // 1. Generate the code
    let gameCode = this.generateCode();
    let allStreets;
    await streets.getStreets(cityName).then((res)=>allStreets = res);
    if(allStreets.streets.length == 0){
      throw ReferenceError;
    }
    // 2. Obtain the street names
    // 3. Create and return the game
    this.gameData[gameCode] = {
      gameCode: gameCode,
      cityName: cityName,
      allStreets: allStreets,
      currentNameIndex: 0,
      chat: [],
      currentSecondsLeft: TOTAL_SECONDS_PER_ROUND,
      totalSeconds: TOTAL_SECONDS_PER_ROUND,
      currentNamePortions: []
    };
    return gameCode;
  }

  getGame(gameCode) {
    return this.gameData[gameCode];
  }


  guess(player, str) {
    let game = getGame(player.gameCode) 
    if(game.allStreets.streets[game.currentNameIndex] == str){
      player.addPoints(TOTAL_SECONDS_PER_ROUND/game.currentSecondsLeft);
      chat.shift(player.name + " guessed the street name");
    } else {
      chat.shift(player.name + ":  " + guess);
    }
  }

  moveToNextName(gameCode) {
    this.gameData[gameCode].currentNameIndex++;
    if (this.gameData[gameCode].currentNameIndex >= this.gameData[gameCode].allStreets.streets.length) {
      // Finished completely
      // TODO: handle
      this.gameData[gameCode].currentNameIndex = 0;
    }
  }

  updateGamesByOneSecond() {
    for (const key of Object.keys(this.gameData)) {
      // Update the game
      this.gameData[key].currentSecondsLeft -= 1;
      // Based on seconds left, reveal another letter
      if (this.gameData[key].currentSecondsLeft % Math.floor(TOTAL_SECONDS_PER_ROUND/this.gameData[key].allStreets.streets[this.gameData[key].currentNameIndex].length) == 0) {
        // TODO: fix this logic
        if (this.gameData[key].currentNamePortions.length == 0) {
          this.gameData[key].currentNamePortions.push(0);
        } else {
          this.gameData[key].currentNamePortions.push(this.gameData[key].currentNamePortions[this.gameData[key].currentNamePortions.length - 1] + 1);
        }
      }
      // Have we reached the end?
      if (this.gameData[key].currentSecondsLeft <= 0) {
        // TODO: clear the chat
        this.gameData[key].currentSecondsLeft = TOTAL_SECONDS_PER_ROUND;
        this.gameData[key].currentNamePortions = [];
        this.moveToNextName(key);
      }
    }
  }
};
module.exports = GameData;
