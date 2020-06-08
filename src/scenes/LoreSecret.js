class LoreSecret extends Phaser.Scene {
    constructor() {
        super("LoreSecret");
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
        this.line1 = this.add.text(centerX, centerY - textSpacer, 'After spending so long in tenebrosity,', textConfig).setOrigin(0.5);
        this.line2 = this.add.text(centerX, centerY, 'Slowly rays of sunlight began to pervade', textConfig).setOrigin(0.5);
        this.line3 = this.add.text(centerX, centerY + textSpacer, 'Into the abyss.', textConfig).setOrigin(0.5);
        this.bottomtext = this.add.text(centerX, centerY*2 - textSpacer, 'PRESS [SPACE] TO CONTINUE', textConfig).setOrigin(0.5);
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(SPACE)) {
            if (textCount == 0) {
                this.line1.text = 'Small holes and cracks in the cave';
                this.line2.text = 'Gave way for the shining sun';
                this.line3.text = 'To assault my dismal fortress.';
                
            }
            if (textCount == 1) {
                this.line1.text = 'It reminded me that there was a feeling';
                this.line2.text = 'Other than the dreary drops of dew';
                this.line3.text = 'That pelted my home.';
               
            }
            if (textCount == 2) {
                this.line1.text = 'A feeling of joy.';
                this.line2.text = 'A feeling of relief.';
                this.line3.text = 'A feeling of satisfaction.';
                
            }
            if (textCount == 3) {
                this.line1.text = '';
                this.line2.text = 'I felt... alive.';
                this.line3.text = '';
                
            }
            if (textCount == 4) {
                this.line1.text = '';
                this.line2.setFontStyle('italic');
                this.line2.text = 'You are not alone.';
                this.line3.text = '';
                
            }
            if (textCount == 5) {
                this.line1.text = '';
                this.line2.text = 'You deserve to be happy.';
                this.line3.text = '';
                
            }
            if (textCount == 6) {
                this.line1.text = '';
                this.line2.text = 'You are the reason that I can smile.';
                this.line3.text = '';
                
            }
            if (textCount == 7) {
                this.line1.text = '';
                this.line2.text = 'You have so much to look forward to.';
                this.line3.text = '';
                
            }
            if (textCount == 8) {
                this.line1.text = '';
                this.line2.text = 'I am proud of you.';
                this.line3.text = '';
                
            }
            if (textCount == 9) {
                this.line1.text = '';
                this.line2.text = 'I love you.';
                this.line3.text = '';
                
            }
            if (textCount == 10) {
                this.line1.text = '';
                this.line2.text = 'You are my Hiro.';
                this.line3.text = '';
                
            }
            if (textCount == 11) {
                this.line1.text = '';
                this.line2.text = '';
                this.line3.text = 'And the rain stopped.';
                
            }
            if(textCount == 12){
                this.scene.start('Credits')
            }
            textCount+=1;
        }
    }
}