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
            //Change 5 to whatever max hearts you want
        })

        //For loop to change visibilty of hearts.
        //Remember the first heart starts at 0 and ends at _health + (num) -1
        for(var i=_health+4;i>_health-1;i--){
            //console.log(i);
            this.hearts.getChildren()[i].setVisible(false);
        }

        sceneEvents.on('player-health-changed',this.handlePlayerHealthChanged, this)
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off('player-health-changed', this.handlePlayerHealthChanged,this)
        })


    }

    handlePlayerHealthChanged(){
        //console.log('test')
        //this.hearts extends Phaser.GameObjects.Image;
        this.hearts.getChildren()[_health].setTexture('ui-heart-empty');
        //this.hearts.getChildren().iterate(e=>e.setTexture('ui-heart-empty'));
        //this.hearts.setTexture('ui-heart-empty');


        //this.hearts.children.iterate(e=>e.setTexture());
    
        

        /*
        this.hearts.children.each((go, idx) => {
            const heart extends Phaser.GameObjects.Image
          if(idx < 3){
                this.hearts.setTexture('ui-heart-full')
            } else {
                this.hearts.setTexture('ui-heart-empty')
            }
        })*/
        
    }

    reset(){
        this.hearts.getChildren()[_health].setTexture('ui-heart-full');
    }

}