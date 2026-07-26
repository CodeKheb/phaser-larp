import { Assets } from "../../shared/Assets";
import { WORLD_WIDTH } from "../../core/config/GameConfig";

export class Player {
    readonly sprite: Phaser.Physics.Arcade.Image;

    constructor(scene: Phaser.Scene) {
        this.sprite = scene.physics.add.image(
            WORLD_WIDTH / 2.5,
            200,
            Assets.CHARACTER
        );

        this.sprite.setBounce(0.25);
        this.sprite.setCollideWorldBounds(true);
    }

    moveLeft() {
        this.sprite.setVelocityX(-360);
        this.sprite.setFlipX(true);
    }

    moveRight() {
        this.sprite.setVelocityX(360);
        this.sprite.setFlipX(false);
    }

    stop() {
        this.sprite.setVelocityX(0);
    }

    jump() {
        if (this.sprite.body?.blocked.down) {
            this.sprite.setVelocityY(-400);
        }
    }
}
