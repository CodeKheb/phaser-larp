import { Assets } from "../../shared/Assets";
import { WorldConfig } from "../../core/config/GameConfig";
import { Attributes } from "../../core/config/PlayerConfig";
import { Interactable } from "../gameObjects/Interactable";
import Phaser from "phaser";

export class Player extends Phaser.Physics.Arcade.Sprite {
    private interactableList: Interactable[] = [];
    private interactedObject: Interactable | null = null;

    constructor(scene: Phaser.Scene) {
        super(scene, WorldConfig.WORLD_WIDTH / 2.15, 200, Assets.CHARACTER);
    
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setBounce(Attributes.BOUNCE_AMOUNT);
        this.setCollideWorldBounds(true);

        this.refreshInteractableList(scene);
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
        this.refreshInteractableList(this.scene);
        this.checkObjectState()
    }

    private checkObjectState(){
        if (!this.interactedObject?.isClicked) {
            this.interactedObject = null
        }
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
        }
    }

    currentPosition(): { x: number; y: number } {
        return { x: this.x, y: this.y };
    }

    moveLeft() {
        if (this.interactedObject) {
            this.interactedObject.setVelocityX(-Attributes.VELOCITY);
            this.interactedObject.setFlipX(true);
        }
        this.setVelocityX(-Attributes.VELOCITY);
        this.setFlipX(true);
    }

    moveRight() {
        if (this.interactedObject) {
            this.interactedObject.setVelocityX(Attributes.VELOCITY);
            this.interactedObject.setFlipX(false);
        }
        this.setVelocityX(Attributes.VELOCITY);
        this.setFlipX(false);
    }

    stopPlayer() {
        if (this.interactedObject) {
            this.interactedObject.setVelocityX(0);
        }
        this.setVelocityX(0);
    }

    jump() {
        if (this.body?.blocked.down) {
            if (this.interactedObject) {
                this.interactedObject.setVelocityY(Attributes.JUMP_HEIGHT);
                console.log(this.interactedObject.isClicked);
                console.log(this.interactedObject);
                
            }
            this.setVelocityY(Attributes.JUMP_HEIGHT);
        }
    }
}
