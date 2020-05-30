let hit = 0

class Game extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    preload() {
        this.load.image('tiles', 'assests/tiles/dungeon_tiles.png');
        this.load.image('ui-heart-empty', 'assests/ui/ui_heart_empty.png')
        this.load.image('ui-heart-full', 'assests/ui/ui_heart_full.png')
        this.load.tilemapTiledJSON('dungeon', 'assests/tiles/dungeon1.json')
        this.load.atlas('faune', 'assests/character/faune.png', 'assests/character/faune.json')
        //this.load.atlas('lizard', 'assests/enemies/lizard.png', 'assests/enemies/lizard.json')
        this.load.spritesheet('slime', 'assests/enemies/slime.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('turret', 'assests/enemies/turretEnemy.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        //this.load.image('faune', 'assests/character/faune.png')


    }

    create() {
        this.scene.run('game-ui')
        //Overlay to be used for DOT
        this.overlay = new Phaser.GameObjects.Graphics(this);
        this.overlay.clear();
        this.overlay.setDepth(100);
        this.add.existing(this.overlay);


        //Basic keyboard commands, may need to change to the cursor key configuration
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        //keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);


        //Adding Tiled's layers to the world
        const map = this.make.tilemap({ key: 'dungeon' })
        const tileset = map.addTilesetImage('dungeon', 'tiles')
        map.createStaticLayer('Ground', tileset)
        wallSlayer = map.createStaticLayer('Walls', tileset)
        wallSlayer.setCollisionByProperty({ collides: true })


        const debugGraphics = this.add.graphics().setAlpha(0.7)
        wallSlayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
            faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        })

        //Adding Player 'Faune' to in-game, adds physics, sets Hitbox, collider with wall, and camera follow respectively
        this.Faune = new Faune(this, 50, 100, 'faune')
        this.physics.world.enable([this.Faune]);
        this.Faune.body.setSize(this.Faune.width * 0.5, this.Faune.height * 0.8)
        this.physics.add.collider(this.Faune, wallSlayer);
        this.cameras.main.startFollow(this.Faune, true)

        //Atlas Anims for Faune (Player)
        this.anims.create({
            key: 'faune-idle-down',
            frames: [{ key: 'faune', frame: 'walk-down-3.png' }]
        })

        this.anims.create({
            key: 'faune-idle-up',
            frames: [{ key: 'faune', frame: 'walk-up-3.png' }]
        })

        this.anims.create({
            key: 'faune-idle-side',
            frames: [{ key: 'faune', frame: 'walk-side-3.png' }]
        })

        this.anims.create({
            key: 'faune-run-down',
            frames: this.anims.generateFrameNames('faune', { suffix: 1, end: 8, prefix: 'run-down-', suffix: '.png' }),
            repeat: -1,
            frameRate: 15
        })

        this.anims.create({
            key: 'faune-run-up',
            frames: this.anims.generateFrameNames('faune', { suffix: 1, end: 8, prefix: 'run-up-', suffix: '.png' }),
            repeat: -1,
            frameRate: 15
        })

        this.anims.create({
            key: 'faune-run-side',
            frames: this.anims.generateFrameNames('faune', { suffix: 1, end: 8, prefix: 'run-side-', suffix: '.png' }),
            repeat: -1,
            frameRate: 15
        })

        this.anims.create({
            key: 'faune-faint',
            frames: this.anims.generateFrameNames('faune', { suffix: 1, end: 4, prefix: 'faint-', suffix: '.png' }),
            frameRate: 15
        })
        //Starts the idle animation
        this.Faune.anims.play('faune-idle-down')

        //Declares Slime (Enemy)
        this.slime = new Slime(this, 150, 100, 'slime');
        this.physics.world.enable([this.slime]);
        this.physics.add.collider(this.slime, wallSlayer, this.slime.updateMovement, undefined, this);
        enemyCollide = this.physics.add.collider(this.slime, this.Faune, this.handleCollision, undefined, this);

        //slime anims
        this.anims.create({
            key: 'slime-idle',
            frames: this.anims.generateFrameNames('slime', { start: 0, end: 16 }),
            repeat: -1,
            frameRate: 10
        })

      //Declares Turret (Enemy)
      this.turret = new Turret(this, 150, 100, 'turret');
      this.physics.world.enable([this.turret]);
      this.physics.add.collider(this.turret, wallSlayer, this.turret.updateMovement, undefined, this);
      enemyCollide = this.physics.add.collider(this.turret, this.Faune, this.handleCollision, undefined, this);

      //turret anims
      this.anims.create({
          key: 'turret-idle',
          frames: this.anims.generateFrameNames('turret', { start: 0, end: 3 }),
          repeat: -1,
          frameRate: 10
      })
      this.anims.create({
        key: 'turret-turn',
        frames: this.anims.generateFrameNames('turret', { start: 4, end: 6 }),
        repeat: -1,
        frameRate: 10
    })
        /*
            this.anims.create({
                key: 'lizard-run',
                frames: this.anims.generateFrameNames('lizard', {start: 0,end: 3, prefix: 'lizard_m_run_anim_f', suffix: '.png'}),
                repeat: -1,
                frameRate: 10
            })
    */
        this.slime.anims.play('slime-idle');
        this.turret.anims.play('turret-idle');



    }


    handleCollision() {
        //console.log('i ran')
        if(playerDead == false){
        const dx = this.Faune.x - this.slime.x
        const dy = this.Faune.y - this.slime.y
        const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)
        this.Faune.handleDamage(dir)

        this.Faune.setVelocity(dir.x, dir.y)
        this.hit = 1

        GameUI.handlePlayerHealthChanged;
        this.slimeEffect();
        sceneEvents.emit('player-health-changed')
        } else{
            this.physics.world.removeCollider(enemyCollide);
            return;
        }

    }



    update() {

        //console.log(this.hit)

        //this.physics.world.collide(this.Lizard, this.Faune);
        this.slime.update()

        if (this.hit > 0) {
            this.Faune.setTint(0xff0000)
            ++this.hit
            if (this.hit > 10) {
                this.hit = 0
                this.Faune.setTint(0xffffff)
            }
            return
        }



        const speed = 100;

    if(playerDead == false){

        if (keyLEFT.isDown) {
            this.Faune.anims.play('faune-run-side', true)
            this.Faune.setVelocity(-speed, 0)

            this.Faune.flipX = true;

        } else if (keyRIGHT.isDown) {
            this.Faune.anims.play('faune-run-side', true)
            this.Faune.setVelocity(speed, 0)
            this.Faune.flipX = false;


        } else if (keyDOWN.isDown) {
            this.Faune.anims.play('faune-run-down', true)
            this.Faune.setVelocity(0, speed)
        } else if (keyUP.isDown) {
            this.Faune.anims.play('faune-run-up', true)
            this.Faune.setVelocity(0, -speed)
        } else {

            const parts = this.Faune.anims.currentAnim.key.split('-')
            parts[1] = 'idle'
            this.Faune.play(parts.join('-'))
            this.Faune.setVelocity(0, 0)
        }

    } else {
        this.Faune.setVelocity(0, 0)
    }



    }

    slimeEffect() {
        //If already Slimed, don't do anything
        if (slimed == false) {
            console.log('slimed');
            slimed = true;
            //create green rectangle to overlay screen
            this.overlay.fillStyle(0x00FF00, 0.2)
            this.overlay.fillRect(-1200, -1200, 2400, 2400);
            //create timer for when the overlay will clear
            var slimeTime = this.time.addEvent({
                delay: 2000,                // 2 seconds
                callback: this.clean,
                callbackScope: this,
                loop: false
            });
        }
    }
    //clean overlay
    clean() {
        this.overlay.clear();
        slimed = false;
    }
}