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
    let gameCode = this.generateCode()
    // 2. Obtain the street names
    // 3. Create and return the game
    this.gameData[gameCode] = {
      gameCode: gameCode,
      cityName: cityName,
      allNames: [
        "Bob Avenue",
        "Alice Avenue",
        "E Peltason Drive"
      ],
      currentNameIndex: 0,
      currentSecondsLeft: 30,
      currentNamePortions: []
    };
    return gameCode;
  }

  getGame(gameCode) {
    return this.gameData[gameCode];
  }

  updateGamesByOneSecond() {
    for (const key of Object.keys(this.gameData)) {
      // Update the game
      this.gameData[key].currentSecondsLeft -= 1;
      // Based on seconds left, reveal another letter
      if (this.gameData[key].currentSecondsLeft % 2 == 0) {
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
