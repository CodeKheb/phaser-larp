import Phaser from "phaser";
import { Assets, AssetPaths } from "../../shared/Assets";
import { Player } from "../../features/player/Player";
import { World } from "../../features/world/World";
import { InputManager } from "../../features/controls/InputManager";
import { Interactable } from "../../features/gameObjects/Interactable";

export class MainScene extends Phaser.Scene {
    private player!: Player;
    private controls!: InputManager;
    private world!: World;
    private interactable!: Interactable;
    private isInZone = false;

    constructor() {
        super("MainScene");
    }

    preload() {
            this.load.image(Assets.CHARACTER, AssetPaths.CHARACTER);
            this.load.image(Assets.PLATFORM, AssetPaths.PLATFORM);
            this.load.image(Assets.LOGO, AssetPaths.LOGO);
            this.load.image(Assets.STAFF, AssetPaths.STAFF)
    }

    create() {
        this.player = new Player(this);
        this.controls = new InputManager(this);
        this.interactable = new Interactable(this, this.player);
        this.world = new World(this);

       // this.interactable = new Interactable(this, this.player);

        this.physics.add.collider(
            this.player.sprite,
            this.world.platforms
        );
        this.physics.add.collider(
            this.interactable,
            this.world.platforms
        )

        this.physics.add.overlap(
            this.player.sprite,
            this.interactable.interactionZone,
            () => {
                this.interactable.setCanInteract(true);
                this.isInZone = true;
            },
            undefined,
            this
        )

        this.cameras.main.startFollow(
            this.player.sprite
        );    
    }

    update() {
        const stillOverlapping = this.physics.overlap(this.player.sprite, this.interactable.interactionZone);

        if (!stillOverlapping && this.isInZone) {
            this.isInZone = false;
            this.interactable.setCanInteract(false);
        }
            
        if (this.controls.left)
            this.player.moveLeft();

        else if (this.controls.right)
            this.player.moveRight();

        else
            this.player.stopPlayer();

        if (this.controls.jump)
            this.player.jump();

        if (this.controls.interactJustPressed) {
            this.player.toggleInteractable();
            console.log("Interact key was pressed");
            console.log(this.children
            .getAll()
            .filter((obj): obj is Interactable => obj instanceof Interactable)
            .filter((interactable) => interactable.interactState));
            
        }
    }
}
