import Phaser from "phaser";


export class GameScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Image;
    private platforms!: Phaser.Physics.Arcade.StaticGroup;
    private background!: Phaser.GameObjects.Image;
    // private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    private keys!: {
        D: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        Space: Phaser.Input.Keyboard.Key;
    };

    constructor() {
        super("GameScene");
    }


    preload() {
            this.load.image(
                "background", 
                '/assets/background.png'
            );

            this.load.image("character", "/assets/character.png");
            this.load.image("ground", "/assets/platform.png");
    }

    create() {
        this.keys = this.input.keyboard!.addKeys("D,A,Space") as {
            D: Phaser.Input.Keyboard.Key;
            A: Phaser.Input.Keyboard.Key;
            Space: Phaser.Input.Keyboard.Key;
       };


        this.background = this.add.image(this.scale.width / 2, this.scale.height / 2,"background");
        this.background.setDisplaySize(this.scale.width, this.scale.height);

        this.resizeBackground();

        this.scale.on('resize', () =>{
                this.resizeBackground();
        }, this);


        this.player = this.physics.add.image(640, 360, "character");

        this.player.setBounce(0.25);
        this.player.setCollideWorldBounds(true);


        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.physics.add.collider(this.player, this.platforms);
        // this.cursors = this.input.keyboard!.createCursorKeys();
    }

    update() {
        if (this.keys.A.isDown) {
            this.player.setVelocityX(-360);
            this.player.setFlipX(true);
        }


        else if (this.keys.D.isDown) {
            this.player.setVelocityX(360);
            this.player.setFlipX(false);
        }

        else {
            this.player.setVelocityX(0);
        }

//        if (this.keys.S.isDown) {
//            this.player.setVelocityY(360);
//        }
//

        if (this.keys.Space.isDown && this.player.body?.blocked.down) {
            this.player.setVelocityY(-400);
        } 

    }
    private resizeBackground(): void {
        if (!this.background) return;

        const screenWidth = this.scale.width;
        const screenHeight = this.scale.height;

        this.background.setPosition(screenWidth / 2, screenHeight / 2);

        const scaleX = screenWidth / this.background.width;
        const scaleY = screenHeight / this.background.height;
        const coverScale = Math.max(scaleX, scaleY);
        this.background.setScale(coverScale);
    }
}
