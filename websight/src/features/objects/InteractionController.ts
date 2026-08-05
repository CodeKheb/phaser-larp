import { Interactable } from "./Interactable";

export class InteractionController {
    private nearby: Interactable | null = null;
    private held: Interactable | null = null;

    update(): void {
        this.nearby = Interactable.getInRange()[0] ?? null;
        if (this.held && !this.held.isClicked) {
            this.held = null;
        }
    }

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
