class Game extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    preload() {
        this.load.image('tiles', 'assests/tiles/dungeon_tiles.png');
        this.load.tilemapTiledJSON('dungeon','assests/tiles/dungeon1.json')
        this.load.atlas('faune', 'assests/character/faune.png', 'assests/character/faune.json')
        this.load.atlas('lizard', 'assests/enemies/lizard.png', 'assests/enemies/lizard.json')

        //this.load.image('faune', 'assests/character/faune.png')


    }

    create() {
        //Basic keyboard commands, may need to change to the cursor key configuration
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        //keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);


        //Adding Tiled's layers to the world
        const map = this.make.tilemap( {key:'dungeon'} )
        const tileset = map.addTilesetImage('dungeon','tiles')
        map.createStaticLayer('Ground',tileset)
        wallSlayer = map.createStaticLayer('Walls',tileset)
        wallSlayer.setCollisionByProperty( {collides: true} )


        const debugGraphics = this.add.graphics().setAlpha(0.7)
        wallSlayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243,234,48,255),
            faceColor: new Phaser.Display.Color(40,39,37,255)
        })

        //Adding Player 'Faune' to in-game, adds physics, sets Hitbox, collider with wall, and camera follow respectively
        this.Faune = new Faune(this, 100, 100, 'faune')
        this.physics.world.enable([ this.Faune ]);
        this.Faune.body.setSize(this.Faune.width * 0.5, this.Faune.height * 0.8)
        this.physics.add.collider(this.Faune, wallSlayer);
        this.cameras.main.startFollow(this.Faune, true)

        //Atlas Anims for Faune (Player)
        this.anims.create({
            key: 'faune-idle-down',
            frames: [{key: 'faune', frame: 'walk-down-3.png' }]
        })

        this.anims.create({
            key: 'faune-idle-up',
            frames: [{ key: 'faune', frame: 'walk-up-3.png'}]
        })

        this.anims.create({
            key: 'faune-idle-side',
            frames: [{ key: 'faune', frame: 'walk-side-3.png' }]
        })

        this.anims.create({
            key: 'faune-run-down',
            frames: this.anims.generateFrameNames('faune', {suffix: 1, end: 8, prefix: 'run-down-', suffix: '.png'}),
            repeat: -1,
            frameRate: 15
        })

        this.anims.create({
            key: 'faune-run-up',
            frames: this.anims.generateFrameNames('faune', {suffix: 1, end: 8, prefix: 'run-up-', suffix: '.png'}),
            repeat: -1,
            frameRate: 15
        })

        this.anims.create({
            key: 'faune-run-side',
            frames: this.anims.generateFrameNames('faune', {suffix: 1, end: 8, prefix: 'run-side-', suffix: '.png'}),
            repeat: -1,
            frameRate: 15
        })
        //Starts the idle animation
        this.Faune.anims.play('faune-idle-down')

        //Declares Lizard (Enemy)
        this.Lizard = new Lizard(this, 150, 100, 'lizard')
        this.physics.world.enable([ this.Lizard ]);
        this.physics.add.collider(this.Lizard, wallSlayer, this.Lizard.updateMovement, undefined, this);
        //this.physics.add.collider(this.Lizard, this.Faune, this.handleCollision(), undefined, this);

        //Lizard anims
        this.anims.create({
            key: 'lizard-idle',
            frames: this.anims.generateFrameNames('lizard', {start: 0,end: 3, prefix: 'lizard_m_idle_anim_f', suffix: '.png'}),
            repeat: -1,
            frameRate: 10
        })
    
        this.anims.create({
            key: 'lizard-run',
            frames: this.anims.generateFrameNames('lizard', {start: 0,end: 3, prefix: 'lizard_m_run_anim_f', suffix: '.png'}),
            repeat: -1,
            frameRate: 10
        })

        this.Lizard.anims.play('lizard-idle')

    }


    /*handleCollision(){
        console.log('test')


    }*/

    

    update() {

        //this.physics.world.collide(this.Lizard, this.Faune);
        this.Lizard.update()



        const speed = 100;

        if(keyLEFT.isDown){
        this.Faune.anims.play('faune-run-side',true)
        this.Faune.setVelocity(-speed,0)

        this.Faune.flipX=true;

        } else if (keyRIGHT.isDown){
            this.Faune.anims.play('faune-run-side',true)
        this.Faune.setVelocity(speed,0)
        this.Faune.flipX=false;


        } else if (keyDOWN.isDown){
            this.Faune.anims.play('faune-run-down',true)
        this.Faune.setVelocity(0,speed)
        }else if (keyUP.isDown){
            this.Faune.anims.play('faune-run-up',true)
        this.Faune.setVelocity(0,-speed)
        }else {
            
            const parts = this.Faune.anims.currentAnim.key.split('-')
            parts[1] = 'idle'
            this.Faune.play(parts.join('-'))
            this.Faune.setVelocity(0,0)

        }

        

    }

   
}