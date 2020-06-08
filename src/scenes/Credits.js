class Credits extends Phaser.Scene {
    constructor() {
        super("Credits");
    }
    create() {
        textCount = 0;
        this.cameras.main.setBackgroundColor('#000000');
        var image = this.add.image(200, 125, 'menulogo').setAlpha(0.3);
        let textConfig = {
            fontFamily: 'Courier',
            fontSize: '20px',
            color: '#FFFFFF',
            stroke: '#cc99ff',
            strokeThickness: 1,
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
        SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.line1 = this.add.text(centerX, centerY - centerY + textSpacer, 'THANK YOU FOR PLAYING', textConfig).setOrigin(0.5);
        this.line2 = this.add.text(centerX, centerY, 'Created by:', textConfig).setOrigin(0.5);
        this.line3 = this.add.text(centerX, centerY + 24, 'Modesto Amador', textConfig).setOrigin(0.5);
        this.line4 = this.add.text(centerX, centerY + 48, 'MiguelCloid Reniva', textConfig).setOrigin(0.5);
        this.line5 = this.add.text(centerX, centerY + 72, 'Brent Mason Hopkins The Great', textConfig).setOrigin(0.5);
        
        this.bottomtext = this.add.text(centerX, centerY*2 - 16, 'PRESS [SPACE] TO GO TO MENU', textConfig).setOrigin(0.5);
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(SPACE)) {
            if(textCount == 1){
                this.scene.start('Menu')
            }
            textCount+=1;
        }
    }
}