import { Assets } from "../../shared/Assets";
import Phaser from "phaser";

export class World {

    readonly platforms;

    constructor(scene: Phaser.Scene) {
            
        scene.add.image(
            scene.scale.width / 2,
            150,
            Assets.LOGO,
        )

        this.platforms =
            scene.physics.add.staticGroup();

        this.platforms
            .create(
                scene.scale.width / 2,
                scene.scale.height,
                Assets.PLATFORM
            )
            .setScale(18)
            .refreshBody();
    }
}
