import { Assets } from "../../shared/Assets";
import Phaser from "phaser";
import { WorldConfig } from "../../core/config/GameConfig";


export class World {

    readonly platforms;

    constructor(scene: Phaser.Scene) {

        this.platforms =
            scene.physics.add.staticGroup();

        this.platforms
            .create(
                WorldConfig.WORLD_WIDTH / 2,
                WorldConfig.GROUND_Y,
                Assets.PLATFORM
            )
            .setScale(50)
            .refreshBody();

            scene.physics.world.setBounds(
                0,
                0,
                WorldConfig.WORLD_WIDTH,
                WorldConfig.WORLD_HEIGHT
            );

            scene.cameras.main.setBounds(
                0,
                0,
                WorldConfig.WORLD_WIDTH,
                WorldConfig.WORLD_HEIGHT * 1.25
            );

            scene.cameras.main.setZoom(WorldConfig.ZOOM_AMOUNT);

        for (let i = 0; i < 20; i++) {
            let RandomSpawnX = Phaser.Math.Between(0, WorldConfig.WORLD_WIDTH);
            let RandomSpawnY = Phaser.Math.Between(0, WorldConfig.WORLD_HEIGHT / 2);
            let RandomScale = Phaser.Math.Between(0, 2);
            scene.add.image(
                RandomSpawnX,
                RandomSpawnY,
                Assets.CLOUD
            )
            .setScale(RandomScale);
        }

        scene.add.image(
            WorldConfig.WORLD_WIDTH / 2,
            WorldConfig.LOGO_Y,
            Assets.LOGO,
        )


            
    }
}
