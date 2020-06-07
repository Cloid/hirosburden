//var newDirection = 4;

class Hand extends Phaser.Physics.Arcade.Sprite{
    
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE,this.updateMovement,this);
        this.updateMovement();

        //A timer to change movement every 2000 seconds
        this.moveEvent = scene.time.addEvent({
            delay: 2000,
            callback: () => {
                this.updateMovement();
            },
            loop: true
        })
        this.anims.play('hand-idle');
        
        //let newDirection = this.updateMovement;

        //console.log(newDirection)
    }

    //Update the current movement of Lizard
    updateMovement(){
        //console.log('i ran')
        let newDirection = Phaser.Math.Between(0,3);

        while (newDirection === this.newDirection){
            newDirection = Phaser.Math.Between(0,3);
        }

        this.newDirection = newDirection

        return this.newDirection;
    }

    preUpdate(time,delta){
        
        //Change velcocity based on direction specified
        super.preUpdate(time,delta);
        const speed = 50;

        //0 = Up, 1 = Down, 2 = Left, 3 = Right

        if(this.newDirection==0){
            this.setVelocity(0,-speed)
            this.flipX=false

        } else if(this.newDirection==1){
            this.setVelocity(0,speed)
            this.flipX=false

        } else if(this.newDirection==2){
            this.setVelocity(-speed,0)
            this.flipX=true

        } else if(this.newDirection==3){
            this.setVelocity(speed,0)
            this.flipX=false

        }
    }
    

}

