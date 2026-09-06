import { Player } from '../player/Player';
import { InteractableConfig } from '../../core/config/InteractableConfig';
import Phaser from 'phaser';

/**
 * Configuration for creating an interactable object.
 *
 * Using one named-options object instead of many positional arguments makes
 * call sites like `new HoldingInteractable(scene, player, { asset, x, y })`
 */
export interface InteractableOptions {
    /** Texture key for the object's sprite. */
    asset: string;
    /** Spawn X position (defaults to 0). */
    x?: number;
    /** Spawn Y position (defaults to 0). */
    y?: number;
    /** Sprite scale (defaults to 1). */
    scale?: number;
    /** Inner glow strength shown while the player is in range (defaults to 0). */
    glowStrength?: number;
    /** How close the player must be to interact (defaults to InteractableConfig.RADIUS). */
    interactionRadius?: number;
}

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
    protected glowStrength: number;
    protected interactionRadius: number;

    /**
     * Creates a new interactable at the given position.
     * @param scene the game scene
     * @param player the player object
     * @param options configuration for this interactable (see {@link InteractableOptions})
     */
    constructor(scene: Phaser.Scene, player: Player, options: InteractableOptions) {
        super(scene, options.x ?? 0, options.y ?? 0, options.asset);
        this.player = player;
        this.glowStrength = options.glowStrength ?? 0;
        this.interactionRadius =
            options.interactionRadius ?? InteractableConfig.RADIUS;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setVisible(true);
        this.setActive(true);
        this.setScale(options.scale ?? 1);

        this.setInteractive({ useHandCursor: true });
        this.input!.enabled = false;

        Interactable.registry.add(this);
    }

    /**
    * Returns all interactables currently in range of the player,
    * sorted by distance to the player (nearest first).
    */
    static getInRange(): Interactable[] {
        const interactablesInRange = [...Interactable.registry].filter(
            (interactable) => interactable.canInteract,
        );

        // All in-range interactables share the same player instance,
        // so grab position once instead of per-comparison.
        if (interactablesInRange.length <= 1) return interactablesInRange;

        const playerPosition = interactablesInRange[0].player.currentPosition();

        return interactablesInRange.sort((firstInteractable, secondInteractable) => {
            const distanceToFirst = Phaser.Math.Distance.Between(
                firstInteractable.x,
                firstInteractable.y,
                playerPosition.x,
                playerPosition.y,
            );
            const distanceToSecond = Phaser.Math.Distance.Between(
                secondInteractable.x,
                secondInteractable.y,
                playerPosition.x,
                playerPosition.y,
            );
            return distanceToFirst - distanceToSecond;
        });
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
            ) <= this.interactionRadius;

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
                this.glowStrength / this.scale,
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
