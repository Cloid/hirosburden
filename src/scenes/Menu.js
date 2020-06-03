class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");
    }
    preload() {
        this.load.audio('song', 'assets/sound/fantasyrpgbg.mp3');
        this.load.audio('oof', 'assets/sound/oof.mp3');
        this.load.image('menulogo', 'assests/ui/hirosburdenlogo.png');
    }
    create() {
        this.cameras.main.setBackgroundColor('#FFFFFF')


        let menuConfig = {
            fontFamily: 'Arial Black',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        var image = this.add.image(175, 50, 'menulogo');
        image.setScale(0.4);


        //show menu text
        let centerX = game.config.width / 2;
        let centerY = game.config.height / 2;
        let textSpacer = 64;



        // this.add.text(centerX, centerY - centerY / 2, "The Hero's Burden", menuConfig).setOrigin(0.5);
         this.add.text(centerX, centerY, 'Press [ M ] to start', menuConfig).setOrigin(0.5);
        // menuConfig.backgroundColor = '#00FF00';
        // menuConfig.color = '#000';

        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        //let myMusic = this.sound.add('song');

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyM)) {
            this.scene.start('Game');       
        }
        
    }
}