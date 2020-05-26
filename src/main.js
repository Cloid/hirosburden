let config = {
    type: Phaser.AUTO,
    width: 400,
    height: 250,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
	scene: [Game, GameUI],
	scale:{
		zoom: 2
	}
};

let game = new Phaser.Game(config);
let keyUP, keyLEFT, keyRIGHT, keyDOWN;
let wallSlayer = null;
let _health = 3;
const sceneEvents = new Phaser.Events.EventEmitter();

//Debuff Effects
var slimed = false;
