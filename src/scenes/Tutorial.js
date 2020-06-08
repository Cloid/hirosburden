class Tutorial extends Phaser.Scene {
    constructor() {
        super("Tutorial");
    }
    create() {
        textCount = 0;
        this.cameras.main.setBackgroundColor('#000000');

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
        this.line1 = this.add.text(centerX, centerY - textSpacer, 'Use the ↑ ↓ → ← keys to move', textConfig).setOrigin(0.5);
        this.line2 = this.add.text(centerX, centerY, 'Use the [ Q ] key to attack', textConfig).setOrigin(0.5);
        this.line3 = this.add.text(centerX, centerY + textSpacer, '', textConfig).setOrigin(0.5);
        this.bottomtext = this.add.text(centerX, centerY*2 - textSpacer, 'PRESS [SPACE] TO CONTINUE', textConfig).setOrigin(0.5);
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(SPACE)) {
            if(textCount == 1){
                this.scene.start('Start')
            }
            textCount+=1;
        }
    }
}