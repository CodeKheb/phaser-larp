import Phaser from 'phaser';
import { AssetPaths, Assets } from '../../shared/Assets';
import { Player } from '../../features/player/Player';
import { InputManager } from '../../features/controls/InputManager';

export class HouseScene extends Phaser.Scene {
    private player!: Player;
    private controls!: InputManager;

    constructor() {
        super('HouseScene');
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

        const constraintWidth = house.displayWidth - 500;
        const constraintHeight = house.displayHeight - 500;

        this.physics.world.setBounds(0, 0, constraintWidth, constraintHeight);
        this.cameras.main.setBounds(0, 0, constraintWidth, constraintHeight);
        this.player = new Player(
            this,
            constraintWidth / 2,
            constraintHeight / 2,
        );
        this.controls = new InputManager(this);

        this.cameras.main.startFollow(this.player);
    }

    update(_time: number, _delta: number): void {
        if (this.controls.left) this.player.moveLeft();
        else if (this.controls.right) this.player.moveRight();
        else this.player.stopPlayer();

        if (this.controls.jump) this.player.jump();

        if (this.controls.escape) {
            this.scene.pause();
            this.scene.launch('MenuScene');
            this.scene.bringToTop('MenuScene');
        }
    }
}
