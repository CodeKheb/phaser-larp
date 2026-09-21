import { Assets } from '../../shared/Assets';
import { World } from '../../features/world/World';
import { GameScene } from './GameScene';
import { HoldingInteractable } from '../../features/objects/behaviors/HoldingInteractable';
import { DialogueInteractable } from '../../features/objects/behaviors/DialogueInteractable';
import { SceneKeys } from '../config/SceneKeys';
import { CameraManager } from '../camera/CameraManager';
import { CollectibleInteractable } from '../../features/objects/behaviors/CollectibleInteractable';
import { SwitchSceneInteractable } from '../../features/objects/behaviors/SwitchSceneInteractable';
import { Interactable } from '../../features/objects/Interactable';

/**
 * Represents the main game scene.
 * Handles the core gameplay mechanics, including the player, world, and interaction systems.
 * It is initialized, loaded, and updated by the Phaser game framework.
 *
 * Referenced by Main.ts as the main scene.
 */
export class MainScene extends GameScene {
    constructor() {
        super(SceneKeys.Main);
    }

    /**
     * Creates all game objects and sets up the gameplay environment:
     * <ul>
     *     <li>player</li>
     *     <li>world (ground, clouds, logo)</li>
     *     <li>controls (keyboard and mobile)</li>
     *     <li>physics colliders</li>
     *     <li>camera (with mobile/desktop zoom settings)</li>
     *     <li>interactable objects (staff, box, house, sign, collectibles)</li>
     * </ul>
     */
    create() {
        // Clear interactable registry to prevent ghost interactables from other scenes
        Interactable.clearRegistry();

        this.world = new World(this);

        // Player and controls come from GameScene
        this.setupPlayer();

        // creates the staff (holdable object)
        HoldingInteractable.spawn(this, { asset: Assets.STAFF });

        // creates the box (holdable object)
        HoldingInteractable.spawn(this, {
            asset: Assets.BOX,
            x: 4500,
            y: 1000,
            scale: 0.15,
            innerGlowIntensity: 2,
        });

        // creates the house (scene switcher)
        SwitchSceneInteractable.spawn(this, {
            targetScene: SceneKeys.House,
            asset: Assets.HOUSE,
            x: 5000,
            y: 1000,
            scale: 1,
            interactionRadius: 320,
        });

        // spawns collectible objects
        CollectibleInteractable.spawn(this, {
            asset: Assets.CUBE,
            respawnMs: 1000,
            scale: 0.25,
        });

        // creates the sign (dialogue object)
        DialogueInteractable.spawn(this, {
            asset: Assets.SIGN,
            message:
                'Welcome to the demo world developed by SSITE!\nExplore and interact with objects.',
            x: this.player.x - 80,
            y: this.player.y,
            scale: 0.5,
        });

        // object colliders and ground placement are wired by spawn();
        // only the player needs a collider here
        this.physics.add.collider(this.player, this.world.platforms);

        new CameraManager(this.cameras.main, {
            mobileFollow: true,
        }).startFollow(this.player);
    }

    /**
     * updates the game state, including player movement, interaction, and physics.
     * Movement, jumping, interaction, and the pause menu are handled by GameScene.
     */
    update(_time: number, delta: number) {
        this.world.update(delta);

        super.update(_time, delta);
    }
}
