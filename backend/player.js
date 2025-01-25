module.exports = class Player {
    id
    name
    char
    gameCode
    points = 0;
    constructor(id, name, char, gameCode){
        this.id = id;
        this.name = name;
        this.char = char;
        this.gameCode = gameCode;
    }
    addPoints(ratio){
        let p = ratio * 500 + 500;
        if(this.char == "rogue"){
            if(ratio >= 0.667){
                p *= 1.5
            }
            if(ratio < 0.166){
                p *= 0.5
            }
        }
        if(this.char == "wizzard"){
            p += Math.floor(Math.random() * 500) - 250;
        }
        if(this.char == "pioneer"){
            p *= 0.8;
        }
        this.points += p;
    }
}