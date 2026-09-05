import { Assets } from '../../shared/Assets';
import { Depth, WorldConfig } from '../../core/config/GameConfig';
import { Attributes } from '../../core/config/PlayerConfig';
import { InteractionController } from '../objects/InteractionController';
import Phaser from 'phaser';

/**
 * Main player class.
 * Handles player movement, interaction, and physics.
 *
 * extends Phaser API's Phaser.Physics.Arcade.Sprite.
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
    private readonly interaction: InteractionController;

    /**
     * creates a new player at the center of the screen.
     * @param scene the game scene you wish to add the player to.
     */
    constructor(scene: Phaser.Scene, x?: number, y?: number) {
        super(
            scene,
            x ?? WorldConfig.WORLD_WIDTH / 2.15,
            y ?? 200,
            Assets.CHARACTER,
        );

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(Attributes.BOUNCE_AMOUNT);
        this.setCollideWorldBounds(true);
        this.setDepth(Depth.PLAYER);

        this.interaction = new InteractionController();
    }

    /**
     * updates the player's state
     * @param time current internal game timestamp
     * @param delta time elapsed since last update
     */
    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
        this.interaction.update();
    }

    toggleInteractable() {
        this.interaction.toggle();
    }

    /*
     *  Character Position and movements
     */

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
