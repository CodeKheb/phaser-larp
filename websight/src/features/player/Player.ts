import { Assets } from "../../shared/Assets";
import { WorldConfig } from "../../core/config/GameConfig";
import { Attributes } from "../../core/config/PlayerConfig";

export class Player {
    readonly sprite: Phaser.Physics.Arcade.Image;

    constructor(scene: Phaser.Scene) {
        this.sprite = scene.physics.add.image(
            WorldConfig.WORLD_WIDTH / 2.15,
            200,
            Assets.CHARACTER
        );

        this.sprite.setBounce(Attributes.BOUNCE_AMOUNT);
        this.sprite.setCollideWorldBounds(true);
    }

    moveLeft() {
        this.sprite.setVelocityX(-Attributes.VELOCITY);
        this.sprite.setFlipX(true);
    }

    moveRight() {
        this.sprite.setVelocityX(Attributes.VELOCITY);
        this.sprite.setFlipX(false);
    }

    stop() {
        this.sprite.setVelocityX(0);
    }

    jump() {
        if (this.sprite.body?.blocked.down) {
            this.sprite.setVelocityY(Attributes.JUMP_HEIGHT);
        }
    }
}
