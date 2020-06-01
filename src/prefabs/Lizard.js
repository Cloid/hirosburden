var direction = ["up", "down", "left", "right"]
var newDirection2 = 4;

class Lizard extends Phaser.Physics.Arcade.Sprite{
    
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame)
        scene.add.existing(this)
        //newDirection2 = this.updateMovement()

        //A timer to change movement every 2000 seconds
        this.moveEvent = scene.time.addEvent({
            delay: 2000,
            callback: () => {
                newDirection2 = this.updateMovement()
            },
            loop: true
        })
        
        //let newDirection2 = this.updateMovement;

        //console.log(newDirection2)
        
    }



    //Update the current movement of Lizard
    updateMovement(){
        newDirection2 = Phaser.Math.Between(0,3)
        //console.log('i ran')
/*
        while(newDirection2 === exclude){
            newDirection2 = Phaser.Math.Between(0,3)
        }*/

        return newDirection2



    }

    preUpdate(){
        super.preUpdate();
        const speed = 50;

        if(newDirection2==0){
            this.setVelocity(0,-speed)
            this.flipX=false

        } else if(newDirection2==1){
            this.setVelocity(0,speed)
            this.flipX=false

        } else if(newDirection2==2){
            this.setVelocity(-speed,0)
            this.flipX=true

        } else if(newDirection2==3){
            this.setVelocity(speed,0)
            this.flipX=false

        }
    }

 

    

}

