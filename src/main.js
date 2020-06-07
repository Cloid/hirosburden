// Hiro's Burden
// A Phaser Game by Brent Hopkins, Modesto Amador, Miguelcloid Reniva
// Made for CMPM 120/ARTG 120 Final Game Project

//Game Configuation
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
    scene: [Menu, Start, Intro1, Floor1, Floor2, Floor3, Game, GameUI],
    scale: {
        zoom: 2
    }
};

//Creating the Game with Game Config
let game = new Phaser.Game(config);

//Setting up music variables to be played
var myMusic = new Audio("assests/sound/gameMusic.mp3");
var oof = new Audio("assests/sound/oof.mp3");
var walk = new Audio("assests/sound/walk.wav");
walk.volume = 0.2;
//walk.loop = true;
//var slimeNoise = new Audio("assests/sound/slime.ogg");

//Setting up keyboard variables for use later on
let keyUP, keyLEFT, keyRIGHT, keyDOWN, keyM, keyQ, keyR;

//Scene Emitter for player-health change
const sceneEvents = new Phaser.Events.EventEmitter();


//Global Variables for use later on
let wallSlayer = null;
let knives = null;
let knife2;
let bullet = null;
let bullets;
let lastKnife = false;
let playerInv = false;
let lizards = null;
let lizard2 = null;
let _health = 3;
let _maxHealth = 3;
var enemyCollide;
var playerSpeed = 100;
var god = false;

//Debuff Effects
var slimed = false;
var possessed = false;
var possessedDirection = 4;
var confused = false;
var playerDead = false;
