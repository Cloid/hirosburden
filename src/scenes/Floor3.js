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
        this.load.image('bullet', 'assests/enemies/bullet.png');

    }

    create() {
        this.clean;
        lastKnife=false;
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
        //this.scene.run('game-ui');

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

        bullet = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
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
        const map = this.make.tilemap({ key: 'floor3' });
        const tileset = map.addTilesetImage('dungeon_tiles', 'tiles');
        map.createStaticLayer('Floor', tileset);
        map.createStaticLayer('Fake Wall', tileset)
        wallSlayer = map.createStaticLayer('Wall', tileset);
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
        this.Faune = new Faune(this, 350, 900, 'player');
        this.physics.world.enable([this.Faune]);
        this.Faune.body.setSize(this.Faune.width * 0.5, this.Faune.height);
        this.Faune.setOffset(8,5);
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

    
        this.physics.add.collider(this.ghosts, wallSlayer);
        this.physics.add.collider(this.ghosts, this.Faune, this.handleGhostCollision, undefined, this);


        this.eyeballs0 = new EyeBall(this, 415, 700, 'eyeball');
        this.eyeballs1 = new EyeBall(this, 415, 550, 'eyeball');
        this.eyeballs2 = new EyeBall(this, 415, 400, 'eyeball');
        this.eyeballs3 = new EyeBall(this, 415, 250, 'eyeball');

        this.physics.world.enable([this.eyeballs0]);
        this.physics.world.enable([this.eyeballs1]);
        this.physics.world.enable([this.eyeballs2]);
        this.physics.world.enable([this.eyeballs3]);



        this.eyeballs0.setAlpha(0.7);
        this.eyeballs1.setAlpha(0.7);
        this.eyeballs2.setAlpha(0.7);
        this.eyeballs3.setAlpha(0.7);

        this.eyeballs0.setImmovable(true)
        this.eyeballs1.setImmovable(true)
        this.eyeballs2.setImmovable(true)
        this.eyeballs3.setImmovable(true)




        //this.physics.add.collider(this.eyeballs, wallSlayer);
        
        //this.physics.add.collider(this.eyeballs, this.Faune, this.handleEyeballCollision, undefined, this);



        this.physics.add.collider(this.ghosts, knives, this.handleKniveGhostCollision, undefined, this);
        //this.physics.add.collider(this.eyeballs, knives, this.handleKniveEnemyCollision, undefined, this);
        this.physics.add.collider(knives, wallSlayer, this.handleKniveWallCollision, undefined, this);
        this.physics.add.collider(bullet, this.Faune, this.handleBulletCollision, undefined, this);

        this.physics.add.collider(this.eyeballs1, this.Faune, this.handleEyeballCollision, undefined, this);
        this.physics.add.collider(this.eyeballs2, this.Faune, this.handleEyeballCollision, undefined, this);
        this.physics.add.collider(this.eyeballs3, this.Faune, this.handleEyeballCollision, undefined, this);

        this.physics.add.collider(bullet, wallSlayer, this.handleBulletWallCollision, undefined, this);


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

        //this.eyeballShoot();
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



        //console.log(this.bulletcd);
        if(this.bulletcd>0){
            ++this.bulletcd;
            if (this.bulletcd > 300) {
                bullet.killAndHide(bullets);
                this.gotHit = false;
                this.bulletcd = 0
            }
        } else{
            console.log('i ran')
        this.eyeballShoot0();
        this.eyeballShoot1();
        this.eyeballShoot2();
        this.eyeballShoot3();
        }

        // if(this.bulletcd2>0){
        //     ++this.bulletcd2;
        //     if (this.bulletcd2 > 500) {
        //         this.gotHit = false;
        //         this.bulletcd2 = 0
        //     }
        // } else{
        // this.eyeballShoot2();
        // }

        // if(this.bulletcd3>0){
        //     ++this.bulletcd3;
        //     if (this.bulletcd3 > 600) {
        //         this.gotHit = false;
        //         this.bulletcd3 = 0
        //     }
        // } else{
        // this.eyeballShoot3();
        // }

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
            //this.physics.add.collider(this.slimes, wallSlayer);
            this.physics.add.collider(this.ghosts, wallSlayer);
            this.physics.add.collider(bullet, wallSlayer, this.handleBulletWallCollision, undefined, this);





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
        console.log('health upgraded');
        _maxHealth += 1;
        _health = _maxHealth;
        sceneEvents.emit('player-health-gained');
        console.log('Max Health is now: '+ _health);

}

replenishHealth(obj, obj2){
        obj2.destroy();
        console.log('health replenished');
        _health = _maxHealth;
        sceneEvents.emit('player-health-replenished');
        console.log('Replenished Health. Health is now: ' + _health);        
}

    handleGhostCollision(obj, enemy) {
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

    handleEyeballCollision(obj1,obj2) {
        console.log('iran')
        obj1.setDrag(100,100)
        if (playerDead == false && playerInv == false && god == false) {
            playerInv = true;
            this.dmgcd=0;
            const dx = this.Faune.x - 50
            const dy = this.Faune.y - 50
            const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)
            this.Faune.handleDamage(dir)

            this.Faune.setVelocity(dir.x, dir.y)
            this.hit = 1

            GameUI.handlePlayerHealthChanged;
            //this.slimeEffect();
            //this.possessedEffect();
            //this.confusedEffect();
            this.cameras.main.shake(1000, 0.01);
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
    handleKniveGhostCollision(enemy) {
        knives.killAndHide(knife2);
        lastKnife=false;
        // lizards.killAndHide(lizard2);
        //lizards.killAndHide(this.lizard3);
        enemy.destroy();
        this.sound.play('ghostDeath');
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
        this.clean();
        this.scene.start('Floor4');       
    }

    handleBulletWallCollision(obj) {
        //bullet.killAndHide(bullets);
        obj.destroy();
        //bullets2.destroy();
        //bullets3.destroy();
        //bullets4.destroy();


    }

    handleBulletCollision() {
        //console.log(enemy)
        this.bulletcd = 1;
        bullet.killAndHide(bullets);

        if(bullet){
            bullets.destroy();
        }

        if(bullets2){
            bullets2.destroy();
        }

        if(bullets3){
            bullets3.destroy();
        }

        if(bullets4){
            bullets4.destroy();
        }

        //this.bulletcd1 = 1;
        //this.bulletcd2 = 1;
        //this.bulletcd3 = 1;
        if (playerDead == false && this.gotHit == false && playerInv == false && god == false) {
            this.cameras.main.shake(500);
            playerInv = true;
            this.dmgcd=0;
            //bullet.killAndHide(bullets);
            const dx = this.Faune.x;
            const dy = this.Faune.y;
            const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)
            this.Faune.handleDamage(dir)

            this.Faune.setVelocity(dir.x, dir.y)
            this.hit = 1
            this.gotHit = true;
            
            god = true;
            var notGod = this.time.addEvent({
                delay: 2000,                // 2 seconds
                callback: this.notGod,
                callbackScope: this,
            });
            GameUI.handlePlayerHealthChanged;
            //this.slimeEffect();
            //this.possessedEffect();
            //this.confusedEffect();
            sceneEvents.emit('player-health-changed')
        } else {
            //this.physics.world.removeCollider(enemyCollide);
            return;
        }

    }

    eyeballShoot0(){
        this.bulletcd=1;

        if(!bullet){
            return;
        }

        bullets = bullet.get(this.eyeballs0.x, this.eyeballs0.y, 'bullet');

        if(!bullets){
            return;
        }

        const vec = new Phaser.Math.Vector2(0, 0);
        vec.y = 1;

        const angle = vec.angle();

        //Faune
        bullets.setActive(true);
        bullets.setVisible(true);
        bullets.setRotation(angle);
        bullets.setVelocity(vec.x * 300, vec.y * 300)
        this.sound.play('laser');
    }

    eyeballShoot1(){
        //this.bulletcd1=1;

        if(!bullet){
            return;
        }

        bullets2 = bullet.get(this.eyeballs1.x, this.eyeballs1.y, 'bullet');

        if(!bullets2){
            return;
        }

        const vec = new Phaser.Math.Vector2(0, 0);
        vec.y = 1;

        const angle = vec.angle();

        //Faune
        bullets2.setActive(true);
        bullets2.setVisible(true);
        bullets2.setRotation(angle);
        bullets2.setVelocity(vec.x * 300, vec.y * 300)
        this.sound.play('laser');
    }

    eyeballShoot2(){
        //this.bulletcd2=1;

        if(!bullet){
            return;
        }

        bullets3 = bullet.get(this.eyeballs2.x, this.eyeballs2.y, 'bullet');

        if(!bullets3){
            return;
        }

        const vec = new Phaser.Math.Vector2(0, 0);
        vec.y = 1;

        const angle = vec.angle();

        //Faune
        bullets3.setActive(true);
        bullets3.setVisible(true);
        bullets3.setRotation(angle);
        bullets3.setVelocity(vec.x * 300, vec.y * 300)
        this.sound.play('laser');
    }

    eyeballShoot3(){
        //this.bulletcd3=1;

        if(!bullet){
            return;
        }

        bullets4 = bullet.get(this.eyeballs3.x, this.eyeballs3.y, 'bullet');

        if(!bullets4){
            return;
        }

        const vec = new Phaser.Math.Vector2(0, 0);
        vec.y = 1;

        const angle = vec.angle();

        //Faune
        bullets4.setActive(true);
        bullets4.setVisible(true);
        bullets4.setRotation(angle);
        bullets4.setVelocity(vec.x * 300, vec.y * 300)
        this.sound.play('laser');
    }

    notGod() {
        god = false;
    }
}

