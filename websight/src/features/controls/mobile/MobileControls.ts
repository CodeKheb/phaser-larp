import { MobileInput } from "./MobileInput";

export class MobileControls {
    private input: MobileInput;
    constructor(input: MobileInput) {
        this.input = input;
        this.bind("left", "left");
        this.bind("right", "right");
        this.bind("jump", "jump");
    }

    private bind(
        id: "left" | "right" | "jump",
        key: keyof MobileInput
    ) {
        const button = document.getElementById(id);
        console.log(id, button);

        if (!button) return;

        button.addEventListener("pointerdown", () => {
            this.input[key] = true;
        });

        const release = () => {
            this.input[key] = false;
        };

        button.addEventListener("pointerup", release);
        button.addEventListener("pointerleave", release);
        button.addEventListener("pointercancel", release);
    }
}
