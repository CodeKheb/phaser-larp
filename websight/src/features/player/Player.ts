import { Assets } from "../../shared/Assets";
import { WorldConfig } from "../../core/config/GameConfig";
import { Attributes } from "../../core/config/PlayerConfig";
import { Interactable } from "../gameObjects/Interactable";
import Phaser from "phaser";

export class Player extends Phaser.Physics.Arcade.Sprite {
    readonly sprite: Phaser.Physics.Arcade.Image;
    private interactableList: Interactable[] = [];
    private interactedObject: Interactable | null = null;

    constructor(scene: Phaser.Scene) {
        super(scene, WorldConfig.WORLD_WIDTH / 2.15, 200, Assets.CHARACTER);
        this.sprite = scene.physics.add.image(
            WorldConfig.WORLD_WIDTH / 2.15,
            200,
            Assets.CHARACTER
        );

        this.sprite.setBounce(Attributes.BOUNCE_AMOUNT);
        this.sprite.setCollideWorldBounds(true);

        this.refreshInteractableList(scene);
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
        this.refreshInteractableList(this.scene);
    }

    private refreshInteractableList(scene: Phaser.Scene): void {
        this.interactableList = scene.children
            .getAll()
            .filter((obj): obj is Interactable => obj instanceof Interactable)
            .filter((interactable) => interactable.interactState);
    }

    toggleInteractable() {
        this.refreshInteractableList(this.scene);

        if (this.interactableList.length > 0) {
            const interactable = this.interactableList[0];
            interactable.toggleClicked();
            this.interactedObject = interactable;
            //console.log(this.interactedObject);
        } else {
            //console.log(this.interactableList);
        }
    }

    currentPosition(): { x: number; y: number } {
        return { x: this.sprite.x, y: this.sprite.y };
    }

    moveLeft() {
        if (this.interactedObject) {
            this.interactedObject.setVelocityX(-Attributes.VELOCITY);
            this.interactedObject.setFlipX(true);
        }
        this.sprite.setVelocityX(-Attributes.VELOCITY);
        this.sprite.setFlipX(true);
    }

    moveRight() {
        if (this.interactedObject) {
            this.interactedObject.setVelocityX(Attributes.VELOCITY);
            this.interactedObject.setFlipX(false);
        }
        this.sprite.setVelocityX(Attributes.VELOCITY);
        this.sprite.setFlipX(false);
    }

    stopPlayer() {
        this.sprite.setVelocityX(0);
    }

    jump() {
        if (this.sprite.body?.blocked.down) {
            if (this.interactedObject) {
                this.interactedObject.setVelocityY(Attributes.JUMP_HEIGHT);
            }
            this.sprite.setVelocityY(Attributes.JUMP_HEIGHT);
        }
    }
}
