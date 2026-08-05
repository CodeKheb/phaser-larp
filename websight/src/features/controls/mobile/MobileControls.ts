import { MobileInput } from "./MobileInput";

export class MobileControls {
    private input: MobileInput;
    constructor(input: MobileInput) {
        this.input = input;
        this.bind("left", "left");
        this.bind("right", "right");
        this.bind("jump", "jump");
        this.bind("interact", "interact");
    }

    private bind(
        id: "left" | "right" | "jump" | "interact",
        key: keyof MobileInput
    ) {
        const button = document.getElementById(id);

        if (!button) return;

        if (key === "interact") {
            button.addEventListener("pointerdown", (e) => {
                e.preventDefault();
                this.input[key] = !this.input[key];
            });
            return;
        }

        button.addEventListener("pointerdown", (e) => {
            e.preventDefault();
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
