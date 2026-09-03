import { Assets } from "../../shared/Assets";
import Phaser from "phaser";
import { Depth, WorldConfig } from "../../core/config/GameConfig";

/**
 * Represents the game world.
 * Contains the game's static environment, such as platforms, clouds, and the player's starting position.
 */
export class World {
  readonly platforms;
  private readonly clouds: Phaser.GameObjects.Image[] = [];

  /**
   * creates the game world. Runs automatically when the game starts.
   * @param scene the game scene
   */
  constructor(scene: Phaser.Scene) {
    // Create a static physics group for the platforms
    this.platforms = scene.physics.add.staticGroup();

    // Creates the ground platform according to WorldConfig.
    this.platforms
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

        /*
            sets up the number of clouds to be generated in the scene.
         */
        for (let i = 0; i < 20; i++) {
            let RandomSpawnX = Phaser.Math.Between(0, WorldConfig.WORLD_WIDTH);
            let RandomSpawnY = Phaser.Math.Between(0, WorldConfig.WORLD_HEIGHT / 2);
            let RandomScale = Phaser.Math.Between(0, 2);
            const cloud = scene.add.image(
                RandomSpawnX,
                RandomSpawnY,
                Assets.CLOUD
            )
                .setScale(RandomScale);

            this.clouds.push(cloud);
        }

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
}
