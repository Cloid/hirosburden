class Lore6 extends Phaser.Scene {
    constructor() {
        super("Lore6");
    }
    create() {
        textCount = 0;
        this.cameras.main.setBackgroundColor('#000000');

        let textConfig = {
            fontFamily: 'Courier',
            fontSize: '11px',
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
        this.line1 = this.add.text(centerX, centerY - textSpacer, 'The rain... it meets its violent end', textConfig).setOrigin(0.5);
        this.line2 = this.add.text(centerX, centerY, 'Exploding across the harsh rocky Earth', textConfig).setOrigin(0.5);
        this.line3 = this.add.text(centerX, centerY + textSpacer, 'Oh, how I long to be like it.', textConfig).setOrigin(0.5);
        this.bottomtext = this.add.text(centerX, centerY*2 - textSpacer, 'PRESS [SPACE] TO CONTINUE', textConfig).setOrigin(0.5);
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(SPACE)) {
            if (textCount == 0) {
                this.line1.text = 'This cave is cold. The fires I build bring me';
                this.line2.text = 'No warmth, dim light that I must squint to perceive.';
                this.line3.text = 'I might as well snuff it out, and be enraptured in the dark.';
                
            }
            if (textCount == 1) {
                this.line1.text = 'Perhaps, maybe this time';
                this.line2.text = 'I can be a little selfish';
                this.line3.text = 'And sing the song of the rain.';
               
            }
            if (textCount == 2) {
                this.line1.text = '';
                this.line2.setFontStyle('italic');
                this.line2.text = 'Pitter-patter.';
                this.line3.text = '';
                
            }
            if(textCount == 3){
                this.scene.start('Credits')
            }
            textCount+=1;
        }
    }
}