import Phaser from 'phaser';
import { Assets } from '../../shared/Assets';
import { SceneKeys } from '../config/SceneKeys';
import { GameScene } from './GameScene';
import { CameraManager } from '../camera/CameraManager';
import { Depth } from '../config/GameConfig';
import { Interactable } from '../../features/objects/Interactable';
import { HoldingInteractable } from '../../features/objects/behaviors/HoldingInteractable';
import { SwitchSceneInteractable } from '../../features/objects/behaviors/SwitchSceneInteractable';

export class HouseScene extends GameScene {
    constructor() {
        super(SceneKeys.House);
    }

    create(): void {
        const camera = new CameraManager(this.cameras.main);

        // Fixed world bounds
        const WORLD_WIDTH = 3000;
        const WORLD_HEIGHT = 3000;

        // Clear interactable registry to prevent ghost interactables from other scenes
        Interactable.clearRegistry();

        this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        // House centered in the world (scrolls with camera)
        const house = this.add.image(
            WORLD_WIDTH / 2,
            WORLD_HEIGHT / 1.25,
            Assets.HOUSE_SCENE,
        );
        house.setDepth(-1); // Render behind everything
        house.setScale(3);

        // Create ground platform
        const platforms = this.physics.add.staticGroup();
        const groundY = WORLD_HEIGHT - 100;
        const ground = platforms
            .create(WORLD_WIDTH / 2, groundY, Assets.PLATFORM)
            .setScale(31)
            .refreshBody();
        ground.setDepth(Depth.BEHIND_PLAYER);

        // Set up player on the ground
        this.setupPlayer(WORLD_WIDTH / 2, groundY - 800);

        // This scene builds its own platforms, so point the interact context at them.
        this.interactContext = {
            player: this.player,
            platforms,
            groundTopY: (ground.body as Phaser.Physics.Arcade.StaticBody).top,
        };

        // Create a box to interact with
        HoldingInteractable.spawn(this, {
            asset: Assets.BOX,
            x: 1000,
            y: 2000,
            scale: 0.15,
            innerGlowIntensity: 2,
        });

        // Create the exit door back to the main scene
        SwitchSceneInteractable.spawn(this, {
            targetScene: SceneKeys.Main,
            asset: Assets.DOOR,
            x: 1000,
            y: 2280,
            innerGlowIntensity: 5,
            interactionRadius: 250,
            scale: 0.5,
        });

        // Player collides with ground (object colliders are wired by spawn())
        this.physics.add.collider(this.player, platforms);

        camera.startFollow(this.player);
    }
}
