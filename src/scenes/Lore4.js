class Lore4 extends Phaser.Scene {
    constructor() {
        super("Lore4");
    }
    create() {
        textCount = 0;
        this.cameras.main.setBackgroundColor('#000000');

        let textConfig = {
            fontFamily: 'Courier',
            fontSize: '12px',
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
        this.line1 = this.add.text(centerX, centerY - textSpacer, 'I feel as if I am moving at a snails pace', textConfig).setOrigin(0.5);
        this.line2 = this.add.text(centerX, centerY, 'Hardly able to tell that I have progressed at all.', textConfig).setOrigin(0.5);
        this.line3 = this.add.text(centerX, centerY + textSpacer, 'How long will it be before I can reach the end?', textConfig).setOrigin(0.5);
        this.bottomtext = this.add.text(centerX, centerY*2 - textSpacer, 'PRESS [SPACE] TO CONTINUE', textConfig).setOrigin(0.5);
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(SPACE)) {
            if (textCount == 0) {
                this.line1.text = 'The rain taunts me with its impunity';
                this.line2.text = 'Splashing and rolling down the outer walls';
                this.line3.text = 'Leaping from the precipice of misery.';
                
            }
            if (textCount == 1) {
                this.line1.text = '';
                this.line2.text = 'Stay strong, Hiro.';
                this.line3.text = '';
               
            }
         
            if(textCount == 2){
                this.scene.start('Floor4')
            }
            textCount+=1;
        }
    }
}