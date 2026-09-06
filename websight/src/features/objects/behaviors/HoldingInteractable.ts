import { Interactable, type InteractableOptions } from '../Interactable';
import { Player } from '../../player/Player';
import Phaser from 'phaser';
import { Depth } from '../../../core/config/GameConfig';

/**
 * An interactable that the player can pick up and carry.
 * Follows the player's movement while held.
 */
export class HoldingInteractable extends Interactable {
    private held: boolean = false;

    /**
     * @param scene the game scene
     * @param player the player object
     * @param options configuration for this holdable object
     *        (x defaults to 50px right of the player, y defaults to player's y)
     */
    constructor(
        scene: Phaser.Scene,
        player: Player,
        options: InteractableOptions,
    ) {
        const pos = player.currentPosition();
        super(scene, player, {
            ...options,
            x: options.x ?? pos.x + 50,
            y: options.y ?? pos.y,
        });
        this.setDepth(Depth.ABOVE_PLAYER);

        this.on(Phaser.Input.Events.POINTER_DOWN, () => this.toggleHeld());
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
        this.followPlayerIfHeld();
    }

    /**
     * Toggles the held state.
     */
    toggleHeld(): void {
        this.held = !this.held;
    }

    /** Whether the object is held and can be interacted with. */
    get isHeld(): boolean {
        return this.canInteract && this.held;
    }

    /** Held objects are activated via toggle, not a separate interaction. */
    onInteract(): void {
        this.toggleHeld();
    }

    /**
     * While held, the object matches the player's velocity and flip state so it moves alongside them.
     */
    private followPlayerIfHeld(): void {
        if (!this.isHeld) {
            this.setVelocityX(0);
            return;
        }
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        this.setVelocityX(body.velocity.x);
        this.setVelocityY(body.velocity.y);
        this.setFlipX(this.player.flipX);
    }
}
