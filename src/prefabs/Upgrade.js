class Upgrade extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this); //add object to existing scene, displayList, updateList
        var pickedup = false;
    }

    hide(){
        this.alpha = 0;
        pickedup = true;
    }
}