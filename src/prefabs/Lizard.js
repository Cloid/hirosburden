var direction = ["up", "down", "left", "right"]
var newDirection = 4;

class Lizard extends Phaser.Physics.Arcade.Sprite{
    
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame)
        scene.add.existing(this)
        //newDirection = this.updateMovement()

        
        this.moveEvent = scene.time.addEvent({
            delay: 2000,
            callback: () => {
                newDirection = this.updateMovement()
            },
            loop: true
        })
        
        //let newDirection = this.updateMovement;

        //console.log(newDirection)
        
    }



    updateMovement(){
        newDirection = Phaser.Math.Between(0,3)
        //console.log('i ran')
/*
        while(newDirection === exclude){
            newDirection = Phaser.Math.Between(0,3)
        }*/

        return newDirection



    }

    update(){
        
        const speed = 50;

        if(newDirection==0){
            this.setVelocity(0,-speed)
            this.flipX=false

        } else if(newDirection==1){
            this.setVelocity(0,speed)
            this.flipX=false

        } else if(newDirection==2){
            this.setVelocity(-speed,0)
            this.flipX=true

        } else if(newDirection==3){
            this.setVelocity(speed,0)
            this.flipX=false

        }


    }

    

}

