class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");
    }
    preload() {
        this.load.audio('oof', 'assests/sound/oof.mp3');
        this.load.audio('laugh', 'assests/sound/laugh.mp3');
        this.load.audio('slimeNoise', 'assests/sound/slime.ogg');
        this.load.audio('bubble', 'assests/sound/bubble.ogg');
        this.load.audio('ghostDeath', 'assests/sound/ghostDeath.ogg');
        this.load.audio('laser', 'assests/sound/laser.ogg');
        this.load.audio('confused', 'assests/sound/confused.ogg');
        this.load.audio('handDeath', 'assests/sound/handDeath.wav');
        this.load.audio('throw', 'assests/sound/throw.wav');
        //this.load.audio('walk', 'assests/sound/walk.wav');
        this.load.image('menulogo', 'assests/ui/hiromenu.png');
    }
    create() {

        this.cameras.main.setBackgroundColor('#808080')
        var image = this.add.image(200, 125, 'menulogo');
        //image.setScale( 1 / 2, 1 / 2 );


        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '24px',
            color: '#FFFFFF',
            stroke: '#666699',
            strokeThickness: 3,
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

 


        //show menu text
        let centerX = game.config.width / 2;
        let centerY = game.config.height / 2;
        let textSpacer = 32;



        // this.add.text(centerX, centerY - centerY / 2, "The Hero's Burden", menuConfig).setOrigin(0.5);
         this.add.text(centerX, centerY+20, 'Press [ SPACEBAR ] to start', menuConfig).setOrigin(0.5);
        // menuConfig.backgroundColor = '#00FF00';
        // menuConfig.color = '#000';

        SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        //let myMusic = this.sound.add('song');

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(SPACE)) {
            this.scene.start('Tutorial');       
        }
        
    }
}