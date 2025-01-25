const streets = require('./streets');
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
    //remove duplicates and undefined
    let seen = new Set();
    seen.add(undefined);
    for(let i = 0; i < allStreets.streets.length; i++){
      if(seen.has(allStreets.streets[i])){
        allStreets.streets.splice(i, 1);
        allStreets.coords.splice(i, 1);
        i--;
      } else {
        seen.add(allStreets.streets[i]);
      }
    }
    //shuffle streets
    for(let i = 0; i < allStreets.streets.length; i++){
      let temp = allStreets.streets[i];
      let tempc = allStreets.coords[i];
      let rand = Math.floor(Math.random() * allStreets.streets.length);
      allStreets.streets[i] = allStreets.streets[rand];
      allStreets.streets[rand] = temp;
      allStreets.coords[i] = allStreets.coords[rand];
      allStreets.coords[rand] = tempc;
    }
    // 2. Obtain the street names
    // 3. Create and return the game
    this.gameData[gameCode] = {
      gameCode: gameCode,
      cityName: cityName,
      allStreets: allStreets,
      currentNameIndex: 0,
      currentSecondsLeft: 30,
      currentNamePortions: [],
      chat: []
    };
    return gameCode;
  }

  getGame(gameCode) {
    return this.gameData[gameCode];
  }

  guess(player, str) {
    let game = getGame(player.gameCode) 
    if(game.allStreets.streets[game.currentNameIndex] == str){
      player.addPoints(30/game.currentSecondsLeft);
    }
  }
  

  updateGamesByOneSecond() {
    for (const key of Object.keys(this.gameData)) {
      // Update the game
      this.gameData[key].currentSecondsLeft -= 1;
      // Based on seconds left, reveal another letter
      if (this.gameData[key].currentSecondsLeft % Math.floor(30/this.gameData[key].allStreets.streets[this.gameData[key].currentNameIndex].length) == 0) {
        // TODO: fix this logic
        if (this.gameData[key].currentNamePortions.length == 0) {
          this.gameData[key].currentNamePortions.push(0);
        } else {
          this.gameData[key].currentNamePortions.push(this.gameData[key].currentNamePortions[this.gameData[key].currentNamePortions.length - 1] + 1);
        }
      }
    }
  }
};
module.exports = GameData;
