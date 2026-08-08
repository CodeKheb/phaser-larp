import Phaser from "phaser";
import { KeyboardInput } from "./keyboard/KeyboardInput";
import { MobileInput } from "./mobile/MobileInput";
import { MobileControls } from "./mobile/MobileControls";

/**
 * Combines keyboard and mobile input into one input source
 * so gameplay code does not need to know which device is being used.
 */
export class InputManager {
    readonly keyboard: KeyboardInput;
    readonly mobile: MobileInput;
    readonly mobileControls: MobileControls;

    /**
     * assigns movement keys to the keyboard and mobile controls.
     * @param scene the game scene
     */
    constructor(scene: Phaser.Scene) {
        this.keyboard = new KeyboardInput(scene);
        this.mobile = new MobileInput();
        this.mobileControls = new MobileControls(this.mobile);
    }

    /*
        returns the current state of the input.
        combines keyboard and mobile input states.
     */
    get left() { return this.keyboard.left || this.mobile.left; }
    get right() { return this.keyboard.right || this.mobile.right; }
    get jump() { return this.keyboard.jump || this.mobile.jump; }
    // keyboard.interact is one-shot, while mobile.interact is currently boolean/held.
    get interact() { return this.keyboard.interact || this.mobile.interact; }
}
