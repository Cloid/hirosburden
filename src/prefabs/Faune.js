class Faune extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame)
        scene.add.existing(this)
        
    }

    
     health(){
        return _health
    }

    preload(){
        
    }

    handleDamage(dir){

        if(_health <= 0){
            return;
        }


        --_health


        if(_health <= 0){
            //this.healthState = HealthState.DEAD
            this.anims.play('faune-faint')
            this.setVelocity(0,0)
            playerDead = true;
        } else {
            this.setVelocity(dir.x,dir.y)
            this.setTint(0xff0000)
            //this.healthState = HealthState.DAMAGE
            //this.damageTime = 0
        }

        console.log(_health)
    }

    update(){
        

    }

    

}

