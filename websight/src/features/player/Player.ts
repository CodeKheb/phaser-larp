import { Assets } from "../../shared/Assets";
import { WorldConfig } from "../../core/config/GameConfig";
import { Attributes } from "../../core/config/PlayerConfig";
import { Interactable } from "../gameObjects/Interactable";
import Phaser from "phaser";

export class Player {
    readonly sprite: Phaser.Physics.Arcade.Image;
    private interactableList: Interactable[] = [];

    constructor(scene: Phaser.Scene) {
        this.sprite = scene.physics.add.image(
            WorldConfig.WORLD_WIDTH / 2.15,
            200,
            Assets.CHARACTER
        );

        this.sprite.setBounce(Attributes.BOUNCE_AMOUNT);
        this.sprite.setCollideWorldBounds(true);

        this.refreshInteractableList(scene);
    }

    currentPosition(): { x: number; y: number } {
        return { x: this.sprite.x, y: this.sprite.y };
    }

    private refreshInteractableList(scene: Phaser.Scene): void {
        this.interactableList = scene.children
            .getAll()
            .filter((obj): obj is Interactable => obj instanceof Interactable)
            .filter((interactable) => interactable.interactState);
    }

    toggleInteractable() {
        this.refreshInteractableList(this.sprite.scene);

        if (this.interactableList.length > 0) {
            const interactable = this.interactableList[0];
            interactable.toggleClicked();
        }
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
