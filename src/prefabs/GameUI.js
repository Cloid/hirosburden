class GameUI extends Phaser.Scene{

    constructor(){
        super({key: 'game-ui'})

    }


    create(){


        this.hearts = this.add.group({
            classType: Phaser.GameObjects.Image
        })

        this.hearts.createMultiple({
            key: 'ui-heart-full',
            setXY: {
                x: 10,
                y: 10,
                stepX:16
            },
            quantity: _health+5
        })

        //For loop to change visibilty of hearts.
        //Remember the first heart starts at 0 and ends at _health + (num) -1
        for(var i=7;i>2;i--){
            this.hearts.getChildren()[i].setVisible(false);
        }

        //When hit by enemy
        sceneEvents.on('player-health-changed',this.handlePlayerHealthChanged, this)
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off('player-health-changed', this.handlePlayerHealthChanged,this)
        })

        //When Player gains a health
        sceneEvents.on('player-health-gained',this.handlePlayerHealthGain, this)
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off('player-health-gained', this.handlePlayerHealthGain,this)
        })

        //When player health is replenished
        sceneEvents.on('player-health-replenished',this.handlePlayerHealthFill, this)
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off('player-health-replenished', this.handlePlayerHealthFill,this)
        })

        //Resetting the game
        sceneEvents.on('reset-game',this.resetGame, this)
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off('reset-game', this.resetGame,this)
        })

    }

    handlePlayerHealthChanged(){
        //console.log('test')
        this.hearts.getChildren()[_health].setTexture('ui-heart-empty');

        
    }

    handlePlayerHealthGain(){
        this.reset();
        this.hearts.getChildren()[_maxHealth-1].setVisible(true);
    }

    handlePlayerHealthFill(){
        this.reset();
    }

    handleNewLevel(){
        //Check for damage hearts and setVisible

        if(_maxHealth>_health){

        }

        for(var i=_maxHealth;i>_health-1;i--){
            this.hearts.getChildren()[i].setVisible(false);
        } 

        for(var i=_maxHealth;i>_health-1;i--){
            this.hearts.getChildren()[i].setTexture('ui-heart-full');
        }

    }

    reset(){
        for(var i=7;i>0;i--){
            this.hearts.getChildren()[i].setTexture('ui-heart-full');
        }        
    }

    resetGame(){
        for(var i=7;i>_health-1;i--){
            this.hearts.getChildren()[i].setVisible(false);
        }

    }

}