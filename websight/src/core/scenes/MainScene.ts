import Phaser from "phaser";
import { Assets, AssetPaths } from "../../shared/Assets";
import { Player } from "../../features/player/Player";
import { World } from "../../features/world/World";
import { InputManager } from "../../features/controls/InputManager";
import { Interactable } from "../../features/objects/Interactable";

export class MainScene extends Phaser.Scene {
    private player!: Player;
    private controls!: InputManager;
    private world!: World;
    private interactable!: Interactable;

    constructor() {
        super("MainScene");
    }

    preload() {
            this.load.image(Assets.CHARACTER, AssetPaths.CHARACTER);
            this.load.image(Assets.PLATFORM, AssetPaths.PLATFORM);
            this.load.image(Assets.LOGO, AssetPaths.LOGO);
            this.load.image(Assets.STAFF, AssetPaths.STAFF)
            this.load.image(Assets.CLOUD, AssetPaths.CLOUD);
    }

    create() {
        this.world = new World(this);

        this.player = new Player(this);
        this.controls = new InputManager(this);
        this.interactable = new Interactable(this, this.player);

        this.physics.add.collider(
            this.player,
            this.world.platforms
        );
        this.physics.add.collider(
            this.interactable,
            this.world.platforms
        )

        this.cameras.main.startFollow(
            this.player
        );    
    }

    update() {
            
        if (this.controls.left)
            this.player.moveLeft();

        else if (this.controls.right)
            this.player.moveRight();

        else
            this.player.stopPlayer();

        if (this.controls.jump)
            this.player.jump();

        if (this.controls.interact) {
            this.player.toggleInteractable();
        }
    }
}
