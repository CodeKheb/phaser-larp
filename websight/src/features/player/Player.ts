import { Assets } from "../../shared/Assets";
import { WorldConfig } from "../../core/config/GameConfig";
import { Attributes } from "../../core/config/PlayerConfig";
import { InteractionController } from "../objects/InteractionController";
import Phaser from "phaser";

export class Player extends Phaser.Physics.Arcade.Sprite {
    private readonly interaction: InteractionController;

    constructor(scene: Phaser.Scene) {
        super(scene, WorldConfig.WORLD_WIDTH / 2.15, 200, Assets.CHARACTER);
    
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setBounce(Attributes.BOUNCE_AMOUNT);
        this.setCollideWorldBounds(true);

        this.interaction = new InteractionController(this);
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
        this.interaction.update();
    }

    toggleInteractable() {
        this.interaction.toggle();
    }

    currentPosition(): { x: number; y: number } {
        return { x: this.x, y: this.y };
    }

    moveLeft() {
        this.setVelocityX(-Attributes.VELOCITY);
        this.setFlipX(true);
    }

    moveRight() {
        this.setVelocityX(Attributes.VELOCITY);
        this.setFlipX(false);
    }

    stopPlayer() {
        this.setVelocityX(0);
    }

    jump() {
        if (this.body?.blocked.down) {
            this.setVelocityY(Attributes.JUMP_HEIGHT);
        }
    }
}
