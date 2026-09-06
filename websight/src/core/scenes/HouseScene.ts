import { AssetPaths, Assets } from '../../shared/Assets';
import { SceneKeys } from '../config/SceneKeys';
import { GameScene } from './GameScene';
import { CameraManager } from '../camera/CameraManager';
import { Depth } from '../config/GameConfig';
import { Interactable } from '../../features/objects/Interactable';
import { HoldingInteractable } from '../../features/objects/behaviors/HoldingInteractable';
import { SwitchSceneInteractable } from '../../features/objects/behaviors/SwitchSceneInteractable';

export class HouseScene extends GameScene {
    private box!: HoldingInteractable;
    private door!: SwitchSceneInteractable;

    constructor() {
        super(SceneKeys.House);
    }

    preload(): void {
        this.load.image(Assets.HOUSE_SCENE, AssetPaths.HOUSE_SCENE);
        this.load.image(Assets.CHARACTER, AssetPaths.CHARACTER);
        this.load.image(Assets.PLATFORM, AssetPaths.PLATFORM);
        this.load.image(Assets.BOX, AssetPaths.BOX);
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
            WORLD_HEIGHT / 2,
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

        // Create a box to interact with
        this.box = new HoldingInteractable(this, this.player, {
            asset: Assets.BOX,
            x: 2000,
            y: 2000,
            scale: 0.3,
            innerGlowIntensity: 2,
        });

        this.door = new SwitchSceneInteractable(this, this.player, {
            targetScene: SceneKeys.Main,
            asset: Assets.DOOR,
            x: 2500,
            y: 2000,
            innerGlowIntensity: 5,
            interactionRadius: 250,
        });

        // Player collides with ground and box
        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(this.box, platforms);
        this.physics.add.collider(this.door, platforms);

        camera.startFollow(this.player);
    }
}
