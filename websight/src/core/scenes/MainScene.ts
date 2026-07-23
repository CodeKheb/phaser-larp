import Phaser from "phaser";
import { Assets, AssetPaths } from "../../shared/Assets";
import { Player } from "../../features/player/Player";
import { World } from "../../features/world/World";
import { PlayerInput } from "../../features/player/PlayerInput";

export class MainScene extends Phaser.Scene {

    private player!: Player;
    private playerInput!: PlayerInput;
    private world!: World;

    constructor() {
        super("MainScene");
    }


    preload() {
            this.load.image(Assets.CHARACTER, AssetPaths.CHARACTER);
            this.load.image(Assets.PLATFORM, AssetPaths.PLATFORM);
            this.load.image(Assets.LOGO, AssetPaths.LOGO);
    }

    create() {
        this.player = new Player(this);

        this.playerInput = new PlayerInput(this);

        this.world = new World(this);

        this.physics.add.collider(
            this.player.sprite,
            this.world.platforms
        );

        this.cameras.main.startFollow(
            this.player.sprite
        );    
    }

    update() {
        if (this.playerInput.left)
            this.player.moveLeft();

        else if (this.playerInput.right)
            this.player.moveRight();

        else
            this.player.stop();

        if (this.playerInput.jump)
            this.player.jump();
    }

}
