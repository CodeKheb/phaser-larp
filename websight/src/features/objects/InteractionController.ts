import { Interactable } from './Interactable';
import { HoldingInteractable } from './behaviors/HoldingInteractable';

/**
 * Controls the interaction between the player and interactable objects.
 * Dispatches the {@link Interactable.onInteract} call to the nearest interactable
 * and separately tracks held objects that subclass {@link HoldingInteractable}.
 *
 * Owned by {@link Player}. See the coupling note on the Player class:
 * interactables may read the player's position but never call its movement
 * methods, so this controller is the main path that triggers interactions.
 */
export class InteractionController {
    private nearby: Interactable | null = null;
    private held: HoldingInteractable | null = null;

    /**
     * Updates the interaction controller each frame.
     * Finds the nearest interactable in range and clears held reference if dropped.
     */
    update(): void {
        this.nearby = Interactable.getInRange()[0] ?? null;

        // Release reference if the held object was dropped
        if (this.held && !this.held.isHeld) {
            this.held = null;
        }
    }

    /**
     * Triggers the interaction on the nearest interactable.
     * For {@link HoldingInteractable} objects, also updates the held reference.
     */
    toggle(): void {
        if (!this.nearby) return;

        this.nearby.onInteract();

        // Track held reference for holding-type interactables
        if (this.nearby instanceof HoldingInteractable) {
            this.held = this.nearby;
        }
    }

    /** The {@link HoldingInteractable} currently held by the player, or null if none. */
    get heldObject(): HoldingInteractable | null {
        return this.held;
    }
}
