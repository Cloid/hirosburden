class Floor3 extends Phaser.Scene {
    constructor() {
        super("Floor3");
    }

    preload() {
        this.load.tilemapTiledJSON('floor3', 'assests/tiles/floor3.json');
        this.load.spritesheet('eyeball', 'assests/enemies/eyeball.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create() {
        this.anims.create({
            key: 'ghost-idle',
            frames: this.anims.generateFrameNames('ghost', { start: 0, end: 13 }),
            repeat: -1,
            frameRate: 10
        })

        this.anims.create({
            key: 'eyeball-idle',
            frames: this.anims.generateFrameNames('eyeball', { start: 0, end: 10 }),
            repeat: -1,
            frameRate: 10
        })
        //Runs a seperate scene as overlay for Health-UI
        this.scene.run('game-ui');

        //Play the music and put on loop
        // myMusic.play();
        // myMusic.loop = true;

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

        //Creating the Map using Tile-Set from Tiled
        const map = this.make.tilemap({ key: 'floor3' });
        const tileset = map.addTilesetImage('dungeon_tiles', 'tiles');
        map.createStaticLayer('Floor', tileset);
        map.createStaticLayer('Fake Wall', tileset)
        wallSlayer = map.createStaticLayer('Wall', tileset);
        this.door = map.createStaticLayer('Door', tileset);
        wallSlayer.setCollisionByProperty({ collides: true });
        this.door.setCollisionByProperty({ collides: true });

        //Deugging Graphics for Wall
        const debugGraphics = this.add.graphics().setAlpha(0.7);
        wallSlayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
            faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        })

        //map.createStaticLayer('Ground', tileset)
        //const floor = map.addTilesetImage('floor1', 'floortile1');

        //Create Player class to be controlled
        this.Faune = new Faune(this, 400, 900, 'player');
        this.physics.world.enable([this.Faune]);
        this.Faune.body.setSize(this.Faune.width * 0.5, this.Faune.height * 0.8);
        this.cameras.main.startFollow(this.Faune, true)
        this.createPlayerAnims();
        this.Faune.anims.play('faune-idle-down');
        this.physics.add.collider(this.Faune, wallSlayer);
        this.physics.add.collider(this.Faune, this.door, this.NextLevel, undefined, this);

        
        this.ghosts = this.physics.add.group({
            classType: Ghost,
            createCallback: (go)=>{
                var ghostGo = go;
                ghostGo.body.onCollide = true;
            }
        })

        const ghostLayer = map.getObjectLayer('Ghosts');
        ghostLayer.objects.forEach(ghostObj =>{
            this.ghosts.get(ghostObj.x,ghostObj.y,'ghost');
        })

        

        this.eyeballs = this.physics.add.group({
            classType: EyeBall,
            createCallback: (go)=>{
                var eyeGo = go;
                eyeGo.body.onCollide = true;
            }
        })

        const eyeballLayer = map.getObjectLayer('Eyes');
        eyeballLayer.objects.forEach(eyeObj =>{
            this.eyeballs.get(eyeObj.x,eyeObj.y,'eyeball');
        })

       

        this.physics.add.collider(this.ghosts, wallSlayer);
        this.physics.add.collider(this.ghosts, this.Faune, this.handleGhostCollision, undefined, this);

        this.physics.add.collider(this.eyeballs, wallSlayer);
        this.physics.add.collider(this.eyeballs, this.Faune, this.handleEyeballCollision, undefined, this);



        this.physics.add.collider(this.ghosts, knives, this.handleKniveEnemyCollision, undefined, this);
        this.physics.add.collider(this.eyeballs, knives, this.handleKniveEnemyCollision, undefined, this);
        this.physics.add.collider(knives, wallSlayer, this.handleKniveWallCollision, undefined, this);

        this.heartscont = this.physics.add.group({
            classType: Upgrade,
        })

        const heartLayer = map.getObjectLayer('Hearts');
        heartLayer.objects.forEach(heartObj =>{
            this.heartscont.get(heartObj.x,heartObj.y,'heart');
        })
        this.physics.add.collider(this.heartscont, this.Faune, this.replenishHealth, undefined, this);
        this.hpcd = 0;

    }

    update(){

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

        if (this.hpcd > 0) {
            ++this.hpcd;
            if (this.hpcd > 10) {
                this.hpcd = 0
            }
            //return
        }

        if(this.knifecd>0){
            ++this.knifecd;
            if (this.knifecd > 25) {
                this.knifecd = 0;
                knives.killAndHide(knife2);
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

            this.Faune.setVelocity(0, 0);
            myMusic.pause();
            this.physics.world.colliders.destroy();
            //this.physics.add.collider(this.slimes, wallSlayer);
            this.physics.add.collider(this.ghosts, wallSlayer);
            this.physics.add.collider(this.eyeballs, wallSlayer);





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

    replenishHealth(obj, obj2){
        if(this.hpcd==0){
            obj2.destroy();
            this.hpcd=1;
            console.log('health replenished');
            _health = _maxHealth;
            sceneEvents.emit('player-health-replenished');
            console.log('Replenished Health. Health is now: ' + _health);
        }
        
    }

    handleGhostCollision(obj, enemy) {
        //console.log(enemy)
        //this.scene.start('Floor1');       

        if (playerDead == false && playerInv == false) {
            playerInv = true;
            this.dmgcd=0;
            const dx = this.Faune.x - enemy.x
            const dy = this.Faune.y - enemy.y
            const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)
            this.Faune.handleDamage(dir)

            this.Faune.setVelocity(dir.x, dir.y)
            this.hit = 1

            GameUI.handlePlayerHealthChanged;
            this.possessedEffect();
            //this.possessedEffect();
            //this.confusedEffect();
            this.sound.play('laugh');
            enemy.destroy();
            god = true;
            var notGod = this.time.addEvent({
                delay: 2000,                // 2 seconds
                callback: this.notGod,
                callbackScope: this,
            });
            sceneEvents.emit('player-health-changed')
        } else {
            //this.physics.world.removeCollider(enemyCollide);
            return;
        }

    }

    handleSlimeCollision(enemy) {
        //console.log(enemy)
        //this.scene.start('Floor1');       

        if (playerDead == false && playerInv == false) {
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

    handleEyeballCollision(enemy) {
        if (playerDead == false && playerInv == false) {
            playerInv = true;
            this.dmgcd=0;
            const dx = this.Faune.x - enemy.x
            const dy = this.Faune.y - enemy.y
            const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)
            this.Faune.handleDamage(dir)

            this.Faune.setVelocity(dir.x, dir.y)
            this.hit = 1

            GameUI.handlePlayerHealthChanged;
            //this.slimeEffect();
            //this.possessedEffect();
            //this.confusedEffect();
            this.cameras.main.shake(500);
            god = true;
            var notGod = this.time.addEvent({
                delay: 2000,                // 2 seconds
                callback: this.notGod,
                callbackScope: this,
            });
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

    handleKniveEnemyCollision(enemy) {
        knives.killAndHide(knife2);
        lastKnife=false;
        // lizards.killAndHide(lizard2);
        //lizards.killAndHide(this.lizard3);
        enemy.destroy();
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

    NextLevel(){
        console.log('Next Level');
    }
    notGod() {
        god = false;
    }
}

