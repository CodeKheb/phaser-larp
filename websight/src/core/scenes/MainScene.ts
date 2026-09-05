import Phaser from 'phaser';
import { Assets, AssetPaths } from '../../shared/Assets';
import { Player } from '../../features/player/Player';
import { World } from '../../features/world/World';
import { InputManager } from '../../features/controls/InputManager';
import { HoldingInteractable } from '../../features/objects/interactable_behaviors/HoldingInteractable.ts';
import { DialogueInteractable } from '../../features/objects/interactable_behaviors/DialogueInteractable.ts';
import { WorldConfig } from '../config/GameConfig.ts';
import { CollectibleInteractable } from '../../features/objects/interactable_behaviors/CollectibleInteractable.ts';

/**
 * Represents the main game scene.
 * Handles the core gameplay mechanics, including the player, world, and interaction systems.
 * It is initialized, loaded, and updated by the Phaser game framework.
 *
 * referenced by main.ts as the main scene
 */
export class MainScene extends Phaser.Scene {
    private player!: Player;
    private controls!: InputManager;
    private world!: World;
    private sign!: DialogueInteractable;
    private staff!: HoldingInteractable;

    constructor() {
        super('MainScene');
    }

    /**
     * preloads all main assets for the game
     */
    preload() {
        this.load.image(Assets.CHARACTER, AssetPaths.CHARACTER);
        this.load.image(Assets.PLATFORM, AssetPaths.PLATFORM);
        this.load.image(Assets.LOGO, AssetPaths.LOGO);
        this.load.image(Assets.STAFF, AssetPaths.STAFF);
        this.load.image(Assets.SIGN, AssetPaths.SIGN);
        this.load.image(Assets.CLOUD, AssetPaths.CLOUD);
        this.load.image(Assets.CUBE, AssetPaths.CUBE);
    }

    /**
     * creates all game objects and sets up the gameplay environment such as
     * <ul>
     *     <li>player</li>
     *     <li>world</li>
     *     <li>controls</li>
     *     <li>physics</li>
     *     <li>camera</li>
     * </ul>
     */
    create() {
        this.world = new World(this);

        this.player = new Player(this);
        this.controls = new InputManager(this);

        // creates the staff (holdable object)
        this.staff = new HoldingInteractable(this, this.player, Assets.STAFF);

        // spawns collectible objects
        CollectibleInteractable.spawn(
            this,
            this.player,
            this.world.platforms,
            Assets.CUBE,
            1000,
        );

        // creates the sign (dialogue object)
        this.sign = new DialogueInteractable(
            this,
            this.player,
            Assets.SIGN,
            'Welcome to the demo world developed by SSITE!\nExplore and interact with objects.',
            this.player.currentPosition().x - 80,
            this.player.currentPosition().y,
        );

        // physics colliders
        this.physics.add.collider(this.player, this.world.platforms);
        this.physics.add.collider(this.staff, this.world.platforms);
        this.physics.add.collider(this.sign, this.world.platforms);

        // automatically place on ground
        this.placeOnGround(this.sign);
        this.placeOnGround(this.staff);

        const camera = this.cameras.main;
        // isMobile boolean if in mobile view
        const isMobile = window.matchMedia('(pointer: coarse)').matches;

        // setZoom if mobile view, set MOBILE_ZOOM else set ZOOM_AMOUNT
        camera.setZoom(
            isMobile ? WorldConfig.MOBILE_ZOOM : WorldConfig.ZOOM_AMOUNT,
        );

        camera.startFollow(this.player);

        // if mobile view MOBILE_ZOOM_OFFSET
        if (isMobile) {
            camera.setFollowOffset(0, WorldConfig.MOBILE_ZOOM_OFFSET);
        }
    }

    /**
     * updates the game state, including player movement, interaction, and physics
     */
    update(_time: number, delta: number) {
        this.world.update(delta);

        if (this.controls.left) this.player.moveLeft();
        else if (this.controls.right) this.player.moveRight();
        else this.player.stopPlayer();

        if (this.controls.jump) this.player.jump();

        if (this.controls.interact) {
            this.player.toggleInteractable();
        }

        if (this.controls.escape) {
            this.scene.pause();
            this.scene.launch('MenuScene');
            this.scene.bringToTop('MenuScene');
        }
    }

    /**
     * @param sprite takes in the phaser sprite
     *
     * this method automatically spawns the sprites on the ground
     */
    private placeOnGround(sprite: Phaser.Physics.Arcade.Sprite) {
        const groundSprite =
            this.world.platforms.getChildren()[0] as Phaser.Physics.Arcade.Sprite;

        const groundBody = groundSprite.body as Phaser.Physics.Arcade.Body;

        Phaser.Display.Bounds.SetBottom(sprite, groundBody.top);

        const body = sprite.body as Phaser.Physics.Arcade.Body;
        body.updateFromGameObject();
    }
}
