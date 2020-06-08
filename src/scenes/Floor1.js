class Floor1 extends Phaser.Scene {
    constructor() {
        super("Floor1");
    }

    preload() {
        this.load.tilemapTiledJSON('floor1', 'assests/tiles/floor1.json');
        this.load.spritesheet('player', 'assests/character/player.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('slime', 'assests/enemies/slime.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('heart', 'assests/ui/heartAnimation.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        

    }

    create() {
        this.clean;
        lastKnife=false;
        this.anims.create({
            key: 'heart-idle',
            frames: this.anims.generateFrameNames('heart', { start: 0, end: 10 }),
            repeat: -1,
            frameRate: 10
        })

        //Setting-up Overlay for alignment effects
        this.overlay = new Phaser.GameObjects.Graphics(this);
        this.overlay.clear();
        this.overlay.setDepth(100);
        this.add.existing(this.overlay);
        this.gotHit = false;

        knives = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize:1
        })

        //Setting-Up Keys
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        //Creating the Map using Tile-Set from Tiled
        const map = this.make.tilemap({ key: 'floor1' });
        const tileset = map.addTilesetImage('dungeon_tiles', 'tiles');
        map.createStaticLayer('Floor', tileset);
        map.createStaticLayer('Fake Wall', tileset);
        wallSlayer = map.createStaticLayer('Wall', tileset,0,0);
        this.door = map.createStaticLayer('Door', tileset);
        wallSlayer.setCollisionByProperty({ collides: true });
        this.door.setCollisionByProperty({ collides: true });

        //Deugging Graphics for Wall
        // const debugGraphics = this.add.graphics().setAlpha(0.7);
        // wallSlayer.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        // })

        //map.createStaticLayer('Ground', tileset)
        //const floor = map.addTilesetImage('floor1', 'floortile1');

        //Create Player class to be controlled
        this.Faune = new Faune(this, 420, 350, 'player');
        this.physics.world.enable([this.Faune]);
        this.Faune.body.setSize(this.Faune.width * 0.5, this.Faune.height);
        this.Faune.setOffset(8,5);
        this.cameras.main.startFollow(this.Faune, true)
        this.createPlayerAnims();
        this.Faune.anims.play('faune-idle-down');
        this.physics.add.collider(this.Faune, wallSlayer);
        this.physics.add.collider(this.Faune, this.door, this.NextLevel, undefined, this);

        
        //Grabs the reference from Tiled Slime Object Group
        this.slimes = this.physics.add.group({
            classType: Slime,
            createCallback: (go)=>{
                // var slimeGo = go;
                // slimeGo.body.onCollide = true;
            }
        })

        const slimesLayer = map.getObjectLayer('Slimes');
        slimesLayer.objects.forEach(slimeObj =>{
            this.slimes.get(slimeObj.x - slimeObj.width * 0.5,slimeObj.y - slimeObj.height * 0.5,'slime');
        })

        this.physics.add.collider(this.slimes, wallSlayer);
        this.physics.add.collider(this.slimes, this.Faune, this.handleCollision, undefined, this);

        this.physics.add.collider(this.slimes, knives, this.handleKniveSlimeCollision, undefined, this);
        this.physics.add.collider(knives, wallSlayer, this.handleKniveWallCollision, undefined, this);

        this.heartscont = this.physics.add.group({
            classType: Upgrade,
        })

        const heartLayer = map.getObjectLayer('Hearts');
        heartLayer.objects.forEach(heartObj =>{
            this.heartscont.get(heartObj.x,heartObj.y,'heart');
        })
        this.physics.add.collider(this.heartscont, this.Faune, this.replenishHealth, undefined, this);

        this.heartup = this.physics.add.group({
                classType: Upgrade,
            })
    
            const secretLayer = map.getObjectLayer('Secret');
            secretLayer.objects.forEach(upObj =>{
                this.heartup.get(upObj.x,upObj.y,'heart').setTint(0xff0000);
            })
            this.physics.add.collider(this.heartup, this.Faune, this.increaseHealth, undefined, this);


    }

    update(){

        if (Phaser.Input.Keyboard.JustDown(keyP) ) {
            this.NextLevel();
        }
        if(playerInv==true){
            ++this.dmgcd;
            this.Faune.setTint(Math.random);
            if(this.dmgcd>40){
                this.Faune.setTint(0xffffff);
                this.dmgcd = 0;
                playerInv=false;
        }
    }

        if (this.hit > 0) {
            this.Faune.setTint(0xff0000)
            ++this.hit;
            if (this.hit > 10) {
                this.hit = 0
                this.Faune.setTint(0xffffff)
            }
            return
        }

        if(this.knifecd>0){
            ++this.knifecd;
            if (this.knifecd > 25) {
                this.knifecd = 0;
                knives.killAndHide(knife2);
                knife2.destroy();
                lastKnife = false;
            }
        }

        //Ability to throw knife
        if (Phaser.Input.Keyboard.JustDown(keyQ) && lastKnife == false) {
            lastKnife = true;
            this.throwKnive();
            this.knifecd = 1;
            return;
        }

        //Player Movement
        if (playerDead == false) {
            if (possessed == false) {
                if (confused == false) {
                    if (keyLEFT.isDown) {
                        this.Faune.anims.play('faune-run-side', true)
                        this.Faune.setVelocity(-playerSpeed, 0)

                        this.Faune.flipX = true;
                        walk.play();
                    } else if (keyRIGHT.isDown) {
                        this.Faune.anims.play('faune-run-side', true)
                        this.Faune.setVelocity(playerSpeed, 0)
                        this.Faune.flipX = false;
                        walk.play();

                    } else if (keyDOWN.isDown) {
                        this.Faune.anims.play('faune-run-down', true)
                        this.Faune.setVelocity(0, playerSpeed)
                        walk.play();
                    } else if (keyUP.isDown) {
                        this.Faune.anims.play('faune-run-up', true)
                        this.Faune.setVelocity(0, -playerSpeed)
                        walk.play();
                    } else {

                        const parts = this.Faune.anims.currentAnim.key.split('-')
                        parts[1] = 'idle'
                        this.Faune.play(parts.join('-'))
                        this.Faune.setVelocity(0, 0)
                        walk.pause();
                    }
                }
                else if (confused == true) {
                    if (keyRIGHT.isDown) {
                        this.Faune.anims.play('faune-run-side', true)
                        this.Faune.setVelocity(-playerSpeed, 0)
                        this.Faune.flipX = true;
                        walk.play();
                    } else if (keyLEFT.isDown) {
                        this.Faune.anims.play('faune-run-side', true)
                        this.Faune.setVelocity(playerSpeed, 0)
                        this.Faune.flipX = false;
                        walk.play();
                    } else if (keyUP.isDown) {
                        this.Faune.anims.play('faune-run-down', true)
                        this.Faune.setVelocity(0, playerSpeed)
                        walk.play();
                    } else if (keyDOWN.isDown) {
                        this.Faune.anims.play('faune-run-up', true)
                        this.Faune.setVelocity(0, -playerSpeed)
                        walk.play();
                    } else {
                        const parts = this.Faune.anims.currentAnim.key.split('-')
                        parts[1] = 'idle'
                        this.Faune.play(parts.join('-'))
                        this.Faune.setVelocity(0, 0)
                        walk.pause();
                    }
                }
            }
        } else {

            this.Faune.setVelocity(0, 0);
            myMusic.pause();
            this.physics.world.colliders.destroy();
            this.physics.add.collider(this.slimes, wallSlayer);



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
            //sceneEvents.emit('reset-game');
            this.scene.start('Start');       
        }


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

    clean() {
        this.overlay.clear();
        console.log('Cleared Effect');
        slimed = false;
        possessed = false;
        confused = false;
        playerSpeed = 100;
    }

    increaseHealth(obj, obj2){
            obj2.destroy();
            this.clean;
            console.log('health upgraded');
            _maxHealth += 1;
            _health = _maxHealth;
            sceneEvents.emit('player-health-gained');
            console.log('Max Health is now: '+ _health);

    }

    replenishHealth(obj, obj2){
            obj2.destroy();
            this.clean;
            console.log('health replenished');
            _health = _maxHealth;
            sceneEvents.emit('player-health-replenished');
            console.log('Replenished Health. Health is now: ' + _health);        
    }

    handleCollision(enemy) {
        //console.log(enemy)
        //this.scene.start('Floor1');       

        if (playerDead == false && playerInv == false && god == false) {
            playerInv = true;
            this.dmgcd=0;
            const dx = this.Faune.x - enemy.x
            const dy = this.Faune.y - enemy.y
            const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)
            this.Faune.handleDamage(dir)

            this.Faune.setVelocity(dir.x, dir.y)
            this.hit = 1

            GameUI.handlePlayerHealthChanged;
            this.slimeEffect();
            god = true;
            var notGod = this.time.addEvent({
                delay: 2000,                // 2 seconds
                callback: this.notGod,
                callbackScope: this,
            });
            //this.possessedEffect();
            //this.confusedEffect();
            sceneEvents.emit('player-health-changed')
        } else {
            //this.physics.world.removeCollider(enemyCollide);
            return;
        }

    }



    handleKniveWallCollision() {
        knives.killAndHide(knife2);
        lastKnife=false;
        knife2.destroy();
    }


    handleKniveSlimeCollision(enemy) {
        knives.killAndHide(knife2);
        lastKnife = false;
        // lizards.killAndHide(lizard2);
        //lizards.killAndHide(this.lizard3);
        enemy.destroy();
        this.sound.play('slimeNoise');
        knife2.destroy();

    }

    slimeEffect() {
        //If already Slimed, don't do anything
        if (slimed == false) {
            slimed = true;
            playerSpeed = 75;
            //create green rectangle to overlay screen
            this.overlay.fillStyle(0x00FF00, 0.2)
            this.overlay.fillRect(-1200, -1200, 2400, 2400);
            this.sound.play('bubble');
            //create timer for when the overlay will clear
            var slimeTime = this.time.addEvent({
                delay: 2000,                // 2 seconds
                callback: this.clean,
                callbackScope: this,
                loop: false
            });
        }
    }

    NextLevel(){
        this.clean();
        this.scene.start('Lore2');       
    }
    notGod() {
        god = false;
    }
}

