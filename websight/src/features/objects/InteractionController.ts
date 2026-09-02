import { Interactable } from "./Interactable";
import { HoldingInteractable } from "./HoldingInteractable";

/**
 * Controls the interaction between the player and interactable objects.
 * Dispatches the generic {@link Interactable.onInteract} call and
 * separately tracks held objects that subclass {@link HoldingInteractable}.
 */
export class InteractionController {
    private nearby: Interactable | null = null;
    private held: HoldingInteractable | null = null;

    /**
     * Updates the interaction controller's state each frame.
     */
    update(): void {
        this.nearby = Interactable.getInRange()[0] ?? null;

        // Release reference if the held object was dropped
        if (this.held && !this.held.isClicked) {
            this.held = null;
        }
    }

    /**
     * Triggers the interaction on the nearest interactable.
     * For {@link HoldingInteractable} objects this also tracks the held state.
     */
    toggle(): void {
        if (!this.nearby) return;

        this.nearby.onInteract();

        // Track held reference for holding-type interactables
        if (this.nearby instanceof HoldingInteractable) {
            this.held = this.nearby;
        }
    }

    /** The object currently held by the player, if any. */
    get heldObject(): HoldingInteractable | null {
        return this.held;
    }
}
