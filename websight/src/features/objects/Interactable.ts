import { Player } from '../player/Player';
import { InteractableConfig } from '../../core/config/InteractableConfig';
import Phaser from 'phaser';

/**
 * Abstract base class for all interactable objects in the game.
 * Handles common functionality: proximity detection, in-range outline, and registry management.
 *
 * Subclasses must implement {@link onInteract} to define their specific interaction behavior.
 */
export abstract class Interactable extends Phaser.Physics.Arcade.Sprite {
    private static registry: Set<Interactable> = new Set();

    protected player: Player;
    protected canInteract: boolean = false;
    protected outlineGlow: Phaser.Filters.Glow | null = null;

    /**
     * Creates a new interactable at the given position.
     * @param scene the game scene
     * @param player the player object
     * @param x spawn X coordinate
     * @param y spawn Y coordinate
     * @param asset the texture key to use
     */
    constructor(
        scene: Phaser.Scene,
        player: Player,
        x: number,
        y: number,
        asset: string,
        scale: number,
    ) {
        super(scene, x, y, asset, scale);
        this.player = player;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setVisible(true);
        this.setActive(true);
        this.setScale(scale);

        this.setInteractive({ useHandCursor: true });
        this.input!.enabled = false;

        Interactable.registry.add(this);
    }

    /**
     * Returns all interactables currently in range of the player.
     */
    static getInRange(): Interactable[] {
        return [...Interactable.registry].filter((i) => i.canInteract);
    }

    destroy(fromScene?: boolean): void {
        Interactable.registry.delete(this);
        this.setOutlineEnabled(false);
        super.destroy(fromScene);
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
        this.updateProximity();
    }

    /**
     * Checks distance to the player and toggles the interaction-enabled state.
     */
    private updateProximity(): void {
        const inRange =
            Phaser.Math.Distance.Between(
                this.x,
                this.y,
                this.player.currentPosition().x,
                this.player.currentPosition().y,
            ) <= InteractableConfig.RADIUS;

        if (inRange !== this.canInteract) {
            this.canInteract = inRange;
            this.input!.enabled = inRange;
            this.setOutlineEnabled(inRange);
            if (inRange) {
                this.onInRange();
            } else {
                this.onOutOfRange();
            }
        }
    }

    /**
     * Shows or hides the outline glow that marks this object as interactable.
     * The outline only appears while the player is within interaction range.
     */
    private setOutlineEnabled(enabled: boolean): void {
        if (enabled && !this.outlineGlow) {
            this.enableFilters();
            if (!this.filters) return; // Filters are WebGL-only; skip if unavailable
            this.outlineGlow = this.filters.internal.addGlow(
                InteractableConfig.OUTLINE_COLOR,
                InteractableConfig.OUTLINE_STRENGTH,
                0,
            );
        } else if (!enabled && this.outlineGlow) {
            this.filters?.internal.remove(this.outlineGlow);
            this.outlineGlow = null;
        }
    }

    /** Whether the player is close enough to interact. */
    get interactState(): boolean {
        return this.canInteract;
    }

    /**
     * Called when the player interacts with this object.
     * Subclasses define what happens here.
     */
    abstract onInteract(): void;

    /**
     * Called when the player moves inside of interaction range.
     * Subclasses can override to perform cleanup (e.g. start glow).
     */
    onInRange(): void {
        // Default: no-op
    }

    /**
     * Called when the player moves out of interaction range.
     * Subclasses can override to perform cleanup (e.g. hide a dialogue).
     */
    onOutOfRange(): void {
        // Default: no-op
    }
}
