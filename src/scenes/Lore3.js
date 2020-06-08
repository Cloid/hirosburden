class Lore3 extends Phaser.Scene {
    constructor() {
        super("Lore3");
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
        this.line1 = this.add.text(centerX, centerY - textSpacer, 'I am haunted by the sounds of this cavern', textConfig).setOrigin(0.5);
        this.line2 = this.add.text(centerX, centerY, 'Are the ghastly voices real or a figment?', textConfig).setOrigin(0.5);
        this.line3 = this.add.text(centerX, centerY + textSpacer, 'I try to cover my ears, but can still hear them.', textConfig).setOrigin(0.5);
        this.bottomtext = this.add.text(centerX, centerY * 2 - textSpacer, 'PRESS [SPACE] TO CONTINUE', textConfig).setOrigin(0.5);
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(SPACE)) {
            if (textCount == 0) {
                this.line1.text = "The rain's melody soothes me";
                this.line2.text = 'Inviting me to join it in freedom';
                this.line3.text = 'From all things that grieve me.';

            }
            if (textCount == 1) {
                this.line1.text = '';
                this.line2.setFontStyle('italic');
                this.line2.text = 'Hang in there, Hiro.';
                this.line3.text = '';

            }
            if (textCount == 2) {
                this.scene.start('Floor3')
            }
            textCount += 1;
        }
    }
}