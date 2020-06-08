class Lore1 extends Phaser.Scene {
    constructor() {
        super("Lore1");
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
        this.line1 = this.add.text(centerX, centerY - textSpacer, '"Where am I?"', textConfig).setOrigin(0.5);
        this.line2 = this.add.text(centerX, centerY, 'I called out to the dark depths of the cave', textConfig).setOrigin(0.5);
        this.line3 = this.add.text(centerX, centerY + textSpacer, 'Hearing only my voice echoing back in return.', textConfig).setOrigin(0.5);
        this.bottomtext = this.add.text(centerX, centerY*2 - textSpacer, 'PRESS [SPACE] TO CONTINUE', textConfig).setOrigin(0.5);
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(SPACE)) {
            if (textCount == 0) {
                this.line1.text = '"Why am I here?"';
                this.line2.text = 'I try to think of a reason but';
                this.line3.text = 'My mind draws a blank as I cower in the shadows.';
                
            }
            if (textCount == 1) {
                this.line1.text = '"What is that sound?"';
                this.line2.text = 'I hear faint rain drops in the distance';
                this.line3.text = 'Pitter-pattering outside of the grotto.';
               
            }
            if (textCount == 2) {
                this.line1.text = 'I do not know what lies ahead';
                this.line2.text = 'But surely it must be better than lying here';
                this.line3.text = 'In this gloomy pit.';
                
            }
            if (textCount == 3) {
                this.line1.text = 'All I can say with certainty';
                this.line2.text = 'Is that I am Hiro.';
                this.line3.text = '';
                
            }
            if(textCount == 4){
                this.scene.start('Floor1')
            }
            textCount+=1;
        }
    }
}