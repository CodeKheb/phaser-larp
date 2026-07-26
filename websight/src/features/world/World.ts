import { Assets } from "../../shared/Assets";
import Phaser from "phaser";
import { WorldConfig } from "../../core/config/GameConfig";

export class World {

    readonly platforms;

    constructor(scene: Phaser.Scene) {
            
        scene.add.image(
            WorldConfig.WORLD_WIDTH / 2,
            WorldConfig.LOGO_Y,
            Assets.LOGO,
        )

        this.platforms =
            scene.physics.add.staticGroup();

        this.platforms
            .create(
                WorldConfig.WORLD_WIDTH / 2,
                WorldConfig.GROUND_Y,
                Assets.PLATFORM
            )
            .setScale(20)
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
                WorldConfig.WORLD_HEIGHT
            );

            scene.cameras.main.setZoom(WorldConfig.ZOOM_AMOUNT);
    }
}
