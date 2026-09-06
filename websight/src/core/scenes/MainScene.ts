import Phaser from 'phaser';
import { Assets, AssetPaths } from '../../shared/Assets';
import { World } from '../../features/world/World';
import { GameScene } from './GameScene';
import { HoldingInteractable } from '../../features/objects/behaviors/HoldingInteractable';
import { DialogueInteractable } from '../../features/objects/behaviors/DialogueInteractable';
import { WorldConfig } from '../config/GameConfig';
import { CollectibleInteractable } from '../../features/objects/behaviors/CollectibleInteractable';
import { SwitchSceneInteractable } from '../../features/objects/behaviors/SwitchSceneInteractable';

/**
 * Represents the main game scene.
 * Handles the core gameplay mechanics, including the player, world, and interaction systems.
 * It is initialized, loaded, and updated by the Phaser game framework.
 *
 * referenced by main.ts as the main scene
 */
export class MainScene extends GameScene {
    private world!: World;
    private sign!: DialogueInteractable;
    private staff!: HoldingInteractable;
    private box!: HoldingInteractable;
    private house!: SwitchSceneInteractable;

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
        this.load.image(Assets.BOX, AssetPaths.BOX);
        this.load.image(Assets.HOUSE, AssetPaths.HOUSE);
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

        // Player and controls come from GameScene
        this.setupPlayer();

        // creates the staff (holdable object)
        this.staff = new HoldingInteractable(this, this.player, {
            asset: Assets.STAFF,
        });

        // creates the box (holdable object)
        this.box = new HoldingInteractable(this, this.player, {
            asset: Assets.BOX,
            x: 4500,
            y: 1000,
            scale: 0.3,
            glowStrength: 2,
        });

        this.house = new SwitchSceneInteractable(this, this.player, {
            targetScene: 'HouseScene',
            asset: Assets.HOUSE,
            x: 5000,
            y: 1000,
            scale: 2,
            interactionRadius: 320,
        });

        // spawns collectible objects
        CollectibleInteractable.spawn(
            this,
            this.player,
            this.world.platforms,
            Assets.CUBE,
            1000,
        );

        // creates the sign (dialogue object)
        this.sign = new DialogueInteractable(this, this.player, {
            asset: Assets.SIGN,
            message:
                'Welcome to the demo world developed by SSITE!\nExplore and interact with objects.',
            x: this.player.x - 80,
            y: this.player.y,
        });

        // physics colliders
        this.physics.add.collider(this.player, this.world.platforms);
        this.physics.add.collider(this.staff, this.world.platforms);
        this.physics.add.collider(this.sign, this.world.platforms);
        this.physics.add.collider(this.box, this.world.platforms);
        this.physics.add.collider(this.house, this.world.platforms);

        // automatically place on ground
        this.placeOnGround(this.sign);
        this.placeOnGround(this.staff);
        this.placeOnGround(this.house);
        this.placeOnGround(this.box);

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
     * updates the game state, including player movement, interaction, and physics.
     * Movement, jumping, interaction, and the pause menu are handled by GameScene.
     */
    update(_time: number, delta: number) {
        this.world.update(delta);

        super.update(_time, delta);
    }

    /**
     * @param sprite takes in the phaser sprite
     *
     * this method automatically spawns the sprites on the ground
     */
    private placeOnGround(sprite: Phaser.Physics.Arcade.Sprite) {
        Phaser.Display.Bounds.SetBottom(sprite, this.world.groundTopY);

        const body = sprite.body as Phaser.Physics.Arcade.Body;
        body.updateFromGameObject();
    }
}
