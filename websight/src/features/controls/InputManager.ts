import Phaser from 'phaser';
import { KeyboardInput } from './keyboard/KeyboardInput';
import { MobileInput } from './mobile/MobileInput';
import { MobileControls } from './mobile/MobileControls';

/**
 * Combines keyboard and mobile input into one input source
 * so gameplay code does not need to know which device is being used.
 */
export class InputManager {
    readonly keyboard: KeyboardInput;
    readonly mobile: MobileInput;
    readonly mobileControls: MobileControls;

    private prevMobileInteract: boolean = false;

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
    get left() {
        return this.keyboard.left || this.mobile.left;
    }
    get right() {
        return this.keyboard.right || this.mobile.right;
    }
    get jump() {
        return this.keyboard.jump || this.mobile.jump;
    }
    get escape() {
        return this.keyboard.escape || this.mobile.settings;
    }

    /**
     * One-shot interact: fires once per press on both keyboard and mobile.
     * Keyboard already uses JustDown; mobile is edge-detected here.
     */
    get interact(): boolean {
        const mobileEdge = this.mobile.interact && !this.prevMobileInteract;
        this.prevMobileInteract = this.mobile.interact;
        return this.keyboard.interact || mobileEdge;
    }
}
