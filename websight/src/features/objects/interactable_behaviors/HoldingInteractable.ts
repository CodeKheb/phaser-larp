import { Interactable } from '../Interactable.ts';
import { Player } from '../../player/Player.ts';
import Phaser from 'phaser';
import { Depth } from '../../../core/config/GameConfig.ts';

/**
 * An interactable that the player can pick up and carry.
 * Follows the player's movement while held.
 */
export class HoldingInteractable extends Interactable {
    private clicked: boolean = false;

    /**
     * @param scene the game scene
     * @param player the player object
     * @param asset the texture key for this object
     * @param x spawn X (defaults to near the player)
     * @param y spawn Y (defaults to the player's Y)
     */
    constructor(scene: Phaser.Scene, player: Player, asset: string, x?: number, y?: number) {
        const pos = player.currentPosition();
        super(scene, player, x ?? pos.x + 50, y ?? pos.y, asset);
        this.setDepth(Depth.ABOVE_PLAYER);

        this.on(Phaser.Input.Events.POINTER_DOWN, () => this.toggleClicked());
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
        this.followPlayerIfHeld();
    }

    /**
     * Toggles the held state on/off.
     */
    toggleClicked(): void {
        this.clicked = !this.clicked;
    }

    /** Whether the object is currently held by the player. */
    get isClicked(): boolean {
        return this.canInteract && this.clicked;
    }

    /** Held objects are activated via toggle, not a separate interaction. */
    onInteract(): void {
        this.toggleClicked();
    }

    /**
     * While held, the object matches the player's velocity so it stays alongside them.
     */
    private followPlayerIfHeld(): void {
        if (!this.isClicked) {
            this.setVelocityX(0);
            return;
        }
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        this.setVelocityX(body.velocity.x);
        this.setVelocityY(body.velocity.y);
        this.setFlipX(this.player.flipX);
    }
}
