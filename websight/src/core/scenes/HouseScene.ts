import { AssetPaths, Assets } from '../../shared/Assets';
import { SceneKeys } from '../config/SceneKeys';
import { GameScene } from './GameScene';

export class HouseScene extends GameScene {
    constructor() {
        super(SceneKeys.House);
    }

    preload(): void {
        this.load.image(Assets.HOUSE_SCENE, AssetPaths.HOUSE_SCENE);
        this.load.image(Assets.CHARACTER, AssetPaths.CHARACTER);
    }

    create(): void {
        const house = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            Assets.HOUSE_SCENE,
        );
        house.setScale(1.8);

        // Add padding around the house image for world bounds
        const constraintWidth = house.displayWidth - 500;
        const constraintHeight = house.displayHeight - 500;

        this.physics.world.setBounds(0, 0, constraintWidth, constraintHeight);
        this.cameras.main.setBounds(0, 0, constraintWidth, constraintHeight);

        // Set up player and controls (inherited from GameScene)
        this.setupPlayer(constraintWidth / 2, constraintHeight / 2);

        this.cameras.main.startFollow(this.player);
    }
}
