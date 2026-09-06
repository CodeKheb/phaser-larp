import { Assets } from '../../shared/Assets';
import Phaser from 'phaser';
import { Depth, WorldConfig } from '../../core/config/GameConfig';

/**
 * Represents the game world.
 * Contains the game's static environment, such as platforms, clouds, and the player's starting position.
 */
export class World {
    readonly platforms;
    /** The main ground platform. Scenes can use {@link groundTopY} to place objects on it. */
    readonly ground: Phaser.Physics.Arcade.Sprite;
    private readonly clouds: Phaser.GameObjects.Image[] = [];

    /**
     * creates the game world. Runs automatically when the game starts.
     * @param scene the game scene
     */
    constructor(scene: Phaser.Scene) {
        // Create a static physics group for the platforms
        this.platforms = scene.physics.add.staticGroup();

        // Creates the ground platform according to WorldConfig.
        this.ground = this.platforms
            .create(
                WorldConfig.WORLD_WIDTH / 2,
                WorldConfig.GROUND_Y,
                Assets.PLATFORM,
            )
            .setScale(50)
            .refreshBody();

        this.platforms.setDepth(Depth.ABOVE_PLAYER);

        // Sets up the world bounds to prevent the player from falling off the screen.
        scene.physics.world.setBounds(
            0,
            0,
            WorldConfig.WORLD_WIDTH,
            WorldConfig.WORLD_HEIGHT,
        );

        // Sets up the camera to follow the player.
        scene.cameras.main.setBounds(
            0,
            0,
            WorldConfig.WORLD_WIDTH,
            WorldConfig.WORLD_HEIGHT * 1.25,
        );

        // Create decorative clouds scattered across the upper half of the world.
        for (let i = 0; i < WorldConfig.CLOUD_AMOUNT; i++) {
            const randomSpawnX = Phaser.Math.Between(0, WorldConfig.WORLD_WIDTH);
            const randomSpawnY = Phaser.Math.Between(0, WorldConfig.WORLD_HEIGHT / 2);
            const randomScale = Phaser.Math.Between(0, 2);
            const cloud = scene.add
                .image(randomSpawnX, randomSpawnY, Assets.CLOUD)
                .setScale(randomScale);

            this.clouds.push(cloud);
        }

        // Adds SSITE logo in the middle of the screen.
        scene.add.image(
            WorldConfig.WORLD_WIDTH / 2,
            WorldConfig.LOGO_Y,
            Assets.LOGO,
        );
    }

    // Move clouds right and recycle them after they leave the world.
    update(delta: number) {
        for (const cloud of this.clouds) {
            cloud.x += WorldConfig.CLOUD_SPEED * delta;

            if (cloud.x > WorldConfig.WORLD_WIDTH + cloud.displayWidth / 2) {
                cloud.x = -cloud.displayWidth / 2;
            }
        }
    }

    /**
     * The Y coordinate of the ground's top surface.
     * Handy for placing objects so they rest exactly on the ground.
     */
    get groundTopY(): number {
        const body = this.ground.body as Phaser.Physics.Arcade.StaticBody;
        return body.top;
    }
}
