let hit = 0

class Game extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    preload() {
        this.load.image('tiles', 'assests/tiles/dungeon_tiles.png');
        this.load.image('ui-heart-empty', 'assests/ui/ui_heart_empty.png');
        this.load.image('ui-heart-full', 'assests/ui/ui_heart_full.png');
        this.load.image('knife', 'assests/weapon/knife.png');
        this.load.image('bullet', 'assests/enemies/bullet.png');
        this.load.tilemapTiledJSON('dungeon', 'assests/tiles/dungeon1.json');
        this.load.atlas('faune', 'assests/character/faune.png', 'assests/character/faune.json');
        this.load.atlas('lizard', 'assests/enemies/lizard.png', 'assests/enemies/lizard.json');
        this.load.spritesheet('player', 'assests/character/player.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('slime', 'assests/enemies/slime.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('turret', 'assests/enemies/turretEnemy.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('healthUpgrade', 'assests/ui/heartAnimation.png', {
            frameWidth: 32,
            frameHeight: 32
        });

    }

    create() {
        this.scene.run('game-ui')
        //Play music
        myMusic.play();
        myMusic.loop = true;
        //Overlay to be used for DOT
        this.overlay = new Phaser.GameObjects.Graphics(this);
        this.overlay.clear();
        this.overlay.setDepth(100);
        this.add.existing(this.overlay);
        this.gotHit = false;

        knives = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize:1
        })

        bullet = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
        })
        


        //Basic keyboard commands, may need to change to the cursor key configuration
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
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
        this.Faune = new Faune(this, 50, 100, 'player')
        this.physics.world.enable([this.Faune]);
        this.Faune.body.setSize(this.Faune.width * 0.5, this.Faune.height * 0.8)
        this.physics.add.collider(this.Faune, wallSlayer);
        this.cameras.main.startFollow(this.Faune, true)

        //Atlas Anims for Faune (Player)
        this.createPlayerAnims();
        //Starts the idle animation
        this.Faune.anims.play('faune-idle-down');

        //Declares Slime (Enemy)
        this.slime = new Slime(this, 150, 100, 'slime');
        this.physics.world.enable([this.slime]);
        this.slime.body.onCollide = true;
        //this.physics.add.collider(this.slime, wallSlayer, this.slime.updateMovement, undefined, this);
        this.physics.add.collider(this.slime, wallSlayer);
        enemyCollide = this.physics.add.collider(this.slime, this.Faune, this.handleCollision, undefined, this);

        //Knive collision
        //this.physics.add.collider(knives,wallSlayer);
        this.physics.add.collider(knives, this.slime, this.handleKniveEnemyCollision, undefined, this);
        this.physics.add.collider(knives, wallSlayer, this.handleKniveWallCollision, undefined, this);

        
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
                this.turret.body.onCollide = true;
                this.physics.add.collider(this.turret, wallSlayer, this.turret.updateMovement, undefined, this);
                enemyCollide = this.physics.add.collider(this.turret, this.Faune, this.handleCollision, undefined, this);
                this.turret.body.setSize(this.turret.width * 0.5, this.turret.height * 0.9);
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

        //Turret Bullet Collision

        //this.physics.add.collider(knives,wallSlayer);
        this.physics.add.collider(bullet, this.Faune, this.handleBulletCollision, undefined, this);

        // lizards = this.physics.add.group({
        //     classType: Lizard,
        // })

        // this.physics.world.enable([lizards]);
        // this.physics.add.collider(lizards, wallSlayer, lizards.updateMovement, undefined, this);
        // this.physics.add.collider(knives, lizards, this.handleKniveEnemyCollision, undefined, this);
        // this.physics.add.collider(lizards, this.Faune, this.handleCollision, undefined, this);
        // lizard2 = lizards.get(100,100,'lizard');
        // lizard2.setActive(true);
        // lizard2.setVisible(true);

        // var lizard3 = lizards.get(100,150,'lizard');
        // lizard3.setActive(true);
        // lizard3.setVisible(true);



        this.healthUpgrade = new Upgrade(this, 50, 50, 'healthUpgrade').setAlpha(1);
        this.anims.create({
            key: 'heart-idle',
            frames: this.anims.generateFrameNames('healthUpgrade', { start: 0, end: 10 }),
            repeat: -1,
            frameRate: 10
        })
        this.healthUpgrade.anims.play('heart-idle');
        this.healthUpgrade.setTint(0xff0000)
        this.physics.world.enable([this.healthUpgrade]);
        this.physics.add.collider(this.Faune, this.healthUpgrade, this.increaseHealth, undefined, this);

        this.healthUpgrade2 = new Upgrade(this, 100, 50, 'healthUpgrade').setAlpha(1);
        this.anims.create({
            key: 'heart-idle',
            frames: this.anims.generateFrameNames('healthUpgrade', { start: 0, end: 10 }),
            repeat: -1,
            frameRate: 10
        })

        this.healthUpgrade2.anims.play('heart-idle');
        this.physics.world.enable([this.healthUpgrade2]);
        this.physics.add.collider(this.Faune, this.healthUpgrade2, this.replenishHealth, undefined, this);

    }

    update() {

        //console.log(this.slime.newDirection)
        //console.log(this.hit)

        //this.physics.world.collide(this.Lizard, this.Faune);

        

        if(this.turret){
            //console.log(this.bulletcd);
            if(this.bulletcd>0){
                ++this.bulletcd;
                if (this.bulletcd > 60) {
                    this.gotHit = false;
                    this.bulletcd = 0
                }
            } else{
            this.turretShoot();
            }
        }


        if (Phaser.Input.Keyboard.JustDown(keyQ) && lastKnife == false) {
            lastKnife = true;
            this.throwKnive();
            //add shit
            return;
        }

        if (this.hit > 0) {
            this.Faune.setTint(0xff0000)
            ++this.hit
            if (this.hit > 10) {
                this.hit = 0
                this.Faune.setTint(0xffffff)
            }
            return
        }




        if (playerDead == false) {
            if (possessed == false) {
                if (confused == false) {
                    if (keyLEFT.isDown) {
                        this.Faune.anims.play('faune-run-side', true)
                        this.Faune.setVelocity(-playerSpeed, 0)

                        this.Faune.flipX = true;

                    } else if (keyRIGHT.isDown) {
                        this.Faune.anims.play('faune-run-side', true)
                        this.Faune.setVelocity(playerSpeed, 0)
                        this.Faune.flipX = false;


                    } else if (keyDOWN.isDown) {
                        this.Faune.anims.play('faune-run-down', true)
                        this.Faune.setVelocity(0, playerSpeed)
                    } else if (keyUP.isDown) {
                        this.Faune.anims.play('faune-run-up', true)
                        this.Faune.setVelocity(0, -playerSpeed)
                    } else {

                        const parts = this.Faune.anims.currentAnim.key.split('-')
                        parts[1] = 'idle'
                        this.Faune.play(parts.join('-'))
                        this.Faune.setVelocity(0, 0)
                    }
                }
                else if (confused == true) {
                    if (keyRIGHT.isDown) {
                        this.Faune.anims.play('faune-run-side', true)
                        this.Faune.setVelocity(-playerSpeed, 0)

                        this.Faune.flipX = true;

                    } else if (keyLEFT.isDown) {
                        this.Faune.anims.play('faune-run-side', true)
                        this.Faune.setVelocity(playerSpeed, 0)
                        this.Faune.flipX = false;


                    } else if (keyUP.isDown) {
                        this.Faune.anims.play('faune-run-down', true)
                        this.Faune.setVelocity(0, playerSpeed)
                    } else if (keyDOWN.isDown) {
                        this.Faune.anims.play('faune-run-up', true)
                        this.Faune.setVelocity(0, -playerSpeed)
                    } else {

                        const parts = this.Faune.anims.currentAnim.key.split('-')
                        parts[1] = 'idle'
                        this.Faune.play(parts.join('-'))
                        this.Faune.setVelocity(0, 0)
                    }
                }
            }
        } else {
            this.Faune.setVelocity(0, 0)
            myMusic.pause();

            let menuConfig = {
                fontFamily: 'Arial Black',
                fontSize: '20px',
                backgroundColor: '#F3B141',
                color: '#843605',
                align: 'right',
                padding: {
                    top: 5,
                    bottom: 5,
                },
                fixedWidth: 0
            }

            let centerX = this.cameras.main.midPoint.x;
        let centerY = this.cameras.main.midPoint.y;
        this.add.text(centerX-100, centerY, 'Press [ R ] to start', menuConfig);
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            playerDead=false;
            _health = 3;
            _maxHealth = 3;
            this.clean();
            sceneEvents.emit('reset-game');
            this.scene.start('Game');       
        }


        }

        if (this.slime) {
            return;
        } else {
            this.slime.update()
        }


    }

    slimeEffect() {
        //If already Slimed, don't do anything
        if (slimed == false) {
            console.log('slimed');
            slimed = true;
            playerSpeed = 75;
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

    possessedEffect() {
        //If already under control, dont do anything
        if (possessed == false) {
            console.log('taken');
            possessed = true;
            //create gray rectangle to overlay screen
            this.overlay.fillStyle(0x7575a3, 0.2)
            this.overlay.fillRect(-1200, -1200, 2400, 2400);
            this.possessedMove = this.time.addEvent({
                delay: 500,
                callback: () => {
                    possessedDirection = this.updatePossesed()
                },
                repeat: 8
            })

            var possessedTime = this.time.addEvent({
                delay: 4000,                // 2 seconds
                callback: this.clean,
                callbackScope: this,
                loop: false
            });
        }
    }

    confusedEffect() {
        //If already under control, dont do anything
        if (confused == false) {
            console.log('confused');
            confused = true;
            //create gray rectangle to overlay screen
            this.overlay.fillStyle(0xF8E522, 0.2)
            this.overlay.fillRect(-1200, -1200, 2400, 2400);

            var confusedTime = this.time.addEvent({
                delay: 10000,                // 2 seconds
                callback: this.clean,
                callbackScope: this,
                loop: false
            });
        }
    }
    //clean overlay
    clean() {
        this.overlay.clear();
        console.log('Cleared Effect');
        slimed = false;
        possessed = false;
        confused = false;
        playerSpeed = 100;
    }

    updatePossesed() {
        console.log('updated movement');
        possessedDirection = Phaser.Math.Between(0, 3);
        if (playerDead == false) {
            if (possessedDirection == 0) {
                this.Faune.anims.play('faune-run-side', true);
                this.Faune.setVelocity(-playerSpeed, 0);
                this.Faune.flipX = true;

            } else if (possessedDirection == 1) {
                this.Faune.anims.play('faune-run-side', true);
                this.Faune.setVelocity(playerSpeed, 0);
                this.Faune.flipX = false;

            } else if (possessedDirection == 2) {
                this.Faune.anims.play('faune-run-down', true);
                this.Faune.setVelocity(0, playerSpeed);

            } else if (possessedDirection == 3) {
                this.Faune.anims.play('faune-run-up', true);
                this.Faune.setVelocity(0, -playerSpeed);

            }
        }
        return possessedDirection;
    }

    increaseHealth(){
        if(this.healthUpgrade.alpha != 0.5){
            this.healthUpgrade.setAlpha(0.5);
            console.log('health upgraded');
            _maxHealth += 1;
            _health = _maxHealth;
            sceneEvents.emit('player-health-gained');
            this.healthUpgrade.destroy();
            console.log('Max Health is now: '+ _health);
        }
    }

    replenishHealth(){
        if(this.healthUpgrade2.alpha != 0.5){
            this.healthUpgrade2.setAlpha(0.5);
            console.log('health replenished');
            _health = _maxHealth;
            sceneEvents.emit('player-health-replenished');
            this.healthUpgrade2.destroy();
            console.log('Replenished Health. Health is now: ' + _health);
        }
    }


    createPlayerAnims(){
        this.anims.create({
            key: 'faune-idle-down',
            frames: this.anims.generateFrameNames('player', { start: 0, end: 0 }),
            repeat: -1,
            frameRate: 15
        })

        this.anims.create({
            key: 'faune-idle-up',
            frames: this.anims.generateFrameNames('player', { start: 21, end: 21 }),
            repeat: -1,
            frameRate: 15
        })

        this.anims.create({
            key: 'faune-idle-side',
            frames: this.anims.generateFrameNames('player', { start: 37, end: 44 }),
            repeat: -1,
            frameRate: 15
        })

        this.anims.create({
            key: 'faune-run-down',
            frames: this.anims.generateFrameNames('player', { start: 13, end: 20 }),
            repeat: -1,
            frameRate: 15
        })

        this.anims.create({
            key: 'faune-run-up',
            frames: this.anims.generateFrameNames('player', { start: 21, end: 28 }),
            repeat: -1,
            frameRate: 15
        })

        this.anims.create({
            key: 'faune-run-side',
            frames: this.anims.generateFrameNames('player', { start: 37, end: 44 }),
            repeat: -1,
            frameRate: 15
        })

        this.anims.create({
            key: 'faune-faint',
            frames: this.anims.generateFrameNames('player', { start: 1, end: 12 }),
            frameRate: 15
        })
    }

    handleCollision(enemy) {
        //console.log(enemy)
        if (playerDead == false) {
            const dx = this.Faune.x - enemy.x
            const dy = this.Faune.y - enemy.y
            const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)
            this.Faune.handleDamage(dir)

            this.Faune.setVelocity(dir.x, dir.y)
            this.hit = 1

            GameUI.handlePlayerHealthChanged;
            //this.slimeEffect();
            //this.possessedEffect();
            this.confusedEffect();
            sceneEvents.emit('player-health-changed')
        } else {
            this.physics.world.removeCollider(enemyCollide);
            return;
        }

    }

    handleBulletCollision() {
        //console.log(enemy)
        this.bulletcd = 1;
        if (playerDead == false && this.gotHit == false) {
            bullet.killAndHide(bullets);
            const dx = this.Faune.x - this.turret.x
            const dy = this.Faune.y - this.turret.y
            const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)
            this.Faune.handleDamage(dir)

            this.Faune.setVelocity(dir.x, dir.y)
            this.hit = 1
            this.gotHit = true;

            GameUI.handlePlayerHealthChanged;
            //this.slimeEffect();
            //this.possessedEffect();
            this.confusedEffect();
            sceneEvents.emit('player-health-changed')
        } else {
            this.physics.world.removeCollider(enemyCollide);
            return;
        }

    }


    checkCollision(player, pickup) {
        // simple AABB checking
        if (player.x < pickup.x + pickup.width / 2 &&
            player.x + player.width / 2 > pickup.x &&
            player.y < pickup.y + pickup.height / 2 &&
            player.height / 2 + player.y > pickup.y) {
            return true;
        } else {
            return false;
        }
    }

    throwKnive() {

        if(!knives){
            return;
        }

        knife2 = knives.get(this.Faune.x, this.Faune.y, 'knife');

        if(!knife2){
            return;
        }

        const parts = this.Faune.anims.currentAnim.key.split('-');
        const direction = parts[2];
        const vec = new Phaser.Math.Vector2(0, 0);
        switch (direction) {
            case 'up':
                vec.y = -1;
                break;
            case 'down':
                vec.y = 1;
                break;
            default:
            case 'side':
                if (this.Faune.flipX) {
                    vec.x = -1
                } else {
                    vec.x = 1;
                }
                break;

        }

        const angle = vec.angle();
        //Faune
        knife2.setActive(true);
        knife2.setVisible(true);
        knife2.setRotation(angle);
        knife2.setVelocity(vec.x * 300, vec.y * 300)

    }

    turretShoot(){
        this.bulletcd=1;

        if(!bullet){
            return;
        }

        bullets = bullet.get(this.turret.x, this.turret.y, 'bullet');

        if(!bullets){
            return;
        }

        const parts = this.turret.newDirection;
        //console.log(parts);
        //const direction = parts;
        const vec = new Phaser.Math.Vector2(0, 0);
        switch (parts) {
            case 0:
                vec.y = -1;
                break;
            case 1:
                vec.y = 1;
                break;
            //For sides    
            default:
                if (this.turret.flipX) {
                    vec.x = -1
                } else {
                    vec.x = 1;
                }
                break;

        }

        const angle = vec.angle();
        //Faune
        bullets.setActive(true);
        bullets.setVisible(true);
        bullets.setRotation(angle);
        bullets.setVelocity(vec.x * 300, vec.y * 300)
    }

    handleKniveWallCollision() {
        knives.killAndHide(knife2);
        lastKnife=false;
    }

    handleKniveEnemyCollision() {
        knives.killAndHide(knife2);
        lastKnife=false;
        // lizards.killAndHide(lizard2);
        //lizards.killAndHide(this.lizard3);
        this.slime.destroy();

    }



}