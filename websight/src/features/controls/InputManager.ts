import Phaser from "phaser";
import { KeyboardInput } from "./keyboard/KeyboardInput";
import { MobileInput } from "./mobile/MobileInput";
import { MobileControls } from "./mobile/MobileControls";


export class InputManager {
    readonly keyboard: KeyboardInput;
    readonly mobile: MobileInput;
    readonly mobileControls: MobileControls;

    constructor(scene: Phaser.Scene) {
        this.keyboard = new KeyboardInput(scene);
        this.mobile = new MobileInput();
        this.mobileControls = new MobileControls(this.mobile);
    }

    get left() {
        return this.keyboard.left || this.mobile.left;
    }

    get right() {
        return this.keyboard.right || this.mobile.right;
    }

    get jump() {
        return this.keyboard.jump || this.mobile.jump;
    }
}
