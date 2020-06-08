class Lore5 extends Phaser.Scene {
    constructor() {
        super("Lore5");
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
        this.line1 = this.add.text(centerX, centerY - textSpacer, 'The green hands of distinguished men fill this cave', textConfig).setOrigin(0.5);
        this.line2 = this.add.text(centerX, centerY, 'Confusing my thoughts three times a day', textConfig).setOrigin(0.5);
        this.line3 = this.add.text(centerX, centerY + textSpacer, 'Telling me not to worry or care or feel.', textConfig).setOrigin(0.5);
        this.bottomtext = this.add.text(centerX, centerY*2 - textSpacer, 'PRESS [SPACE] TO CONTINUE', textConfig).setOrigin(0.5);
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(SPACE)) {
            if (textCount == 0) {
                this.line1.text = 'They tell me to not fall for the tricks of the rain';
                this.line2.text = 'But without the somber chords of raindrops';
                this.line3.text = 'All that fills reverberates is crackling thunder';
                
            }
            if (textCount == 1) {
                this.line1.text = '';
                this.line2.setFontStyle('italic');
                this.line2.text = 'It will be better tomorrow, Hiro.';
                this.line3.text = '';
               
            }
         
            if(textCount == 2){
                this.scene.start('Floor5')
            }
            textCount+=1;
        }
    }
}