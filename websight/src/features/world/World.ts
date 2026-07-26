import { Assets } from "../../shared/Assets";
import Phaser from "phaser";
import { GROUND_Y, WORLD_HEIGHT, WORLD_WIDTH } from "../../core/config/GameConfig";

export class World {

    readonly platforms;

    constructor(scene: Phaser.Scene) {
            
        scene.add.image(
            WORLD_WIDTH / 2,
            150,
            Assets.LOGO,
        )

        this.platforms =
            scene.physics.add.staticGroup();

        this.platforms
            .create(
                WORLD_WIDTH / 2,
                GROUND_Y,
                Assets.PLATFORM
            )
            .setScale(20)
            .refreshBody();

            scene.physics.world.setBounds(
                0,
                0,
                WORLD_WIDTH,
                WORLD_HEIGHT
            );

            scene.cameras.main.setBounds(
                0,
                0,
                WORLD_WIDTH,
                WORLD_HEIGHT
            );
    }
}
