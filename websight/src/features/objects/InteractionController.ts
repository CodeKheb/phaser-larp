import { Interactable } from "./Interactable";

/**
 * Controls the interaction between the player and interactable objects.
 */
export class InteractionController {
    private nearby: Interactable | null = null;
    private held: Interactable | null = null;

    /**
     * updates the interaction controller's state.
     */
    update(): void {
        this.nearby = Interactable.getInRange()[0] ?? null;
        if (this.held && !this.held.isClicked) {
            this.held = null;
        }
    }

    /**
     * toggles the held object.
     */
    toggle(): void {
        if (this.nearby) {
            this.nearby.toggleClicked();
            this.held = this.nearby;
        }
    }

    get heldObject(): Interactable | null {
        return this.held;
    }

}
