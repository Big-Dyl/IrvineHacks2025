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
    this.DELAY = 100;
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
      currentNamePortions: [],
      playersSuccessful: [],
      playerCount: 0
    };
    return gameCode;
  }

  getGame(gameCode) {
    return this.gameData[gameCode];
  }

  doesGameCodeExist(gameCode) {
    return Object.keys(this.gameData).includes(gameCode);
  }

  guess(player, str, playerCount) {
    // TODO: fully implement/check
    if (this.gameData[player.gameCode].playersSuccessful.includes(player.gameCode)) {
      // Already answered
      console.log("Player already answered");
      return;
    }

    if (this.gameData[player.gameCode].allStreets.streets[this.gameData[player.gameCode].currentNameIndex].toLowerCase().trim() == str.toLowerCase().trim()) {
      const ratio = this.gameData[player.gameCode].currentSecondsLeft/TOTAL_SECONDS_PER_ROUND;
      player.addPoints(ratio);
      this.gameData[player.gameCode].chat.push(player.name + " guessed the street name correctly!");
      this.gameData[player.gameCode].playersSuccessful.push(player.id);
    } else {
      this.gameData[player.gameCode].chat.push(player.name + ":  " + str);
    }
    // Keep the chat small enough to see easily
    while (this.gameData[player.gameCode].chat.length > 10) this.gameData[player.gameCode].chat.shift();

    // Check if everyone has already answered correctly
    if (this.gameData[player.gameCode].playersSuccessful.length >= playerCount) {
      this.moveToNextName(player.gameCode);
    }
  }

  moveToNextName(gameCode) {
    this.gameData[gameCode].currentSecondsLeft = TOTAL_SECONDS_PER_ROUND;
    this.gameData[gameCode].currentNamePortions = [];
    this.gameData[gameCode].playersSuccessful = [];
    this.gameData[gameCode].chat.push("-------");
    this.gameData[gameCode].currentNameIndex++;
    if (this.gameData[gameCode].currentNameIndex >= this.gameData[gameCode].allStreets.streets.length) {
      // Finished completely
      // TODO: handle
      this.gameData[gameCode].currentNameIndex = 0;
    }
  }

  update() {
    for (const key of Object.keys(this.gameData)) {
      // Update the game
      this.gameData[key].currentSecondsLeft -= this.DELAY/1000;
      // Based on seconds left, reveal another letter
      const percentTimeElapsed = 1 - (this.gameData[key].currentSecondsLeft / this.gameData[key].totalSeconds);
      const percentWordRevealed = this.gameData[key].currentNamePortions.length / this.gameData[key].allStreets.streets[this.gameData[key].currentNameIndex].length;
      //if (Math.floor(this.gameData[key].currentSecondsLeft) % Math.floor(TOTAL_SECONDS_PER_ROUND/this.gameData[key].allStreets.streets[this.gameData[key].currentNameIndex].length) == 0) {
      if (percentTimeElapsed > percentWordRevealed) {
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
        this.moveToNextName(key);
      }
    }
  }
};
module.exports = GameData;
