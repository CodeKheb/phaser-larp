import Phaser from 'phaser';
import { MobileInput } from './MobileInput';

/**
 * Connects HTML mobile control buttons to the game's input system.
 *
 * Button IDs are defined in index.html. The buttons are static DOM nodes
 * shared by every scene, so the owning scene's shutdown removes this
 * instance's listeners and keeps them from accumulating on the buttons.
 * Sleeping scenes keep their listeners until they shut down.
 */
export class MobileControls {
    private input: MobileInput;

    /** Removal callbacks for every DOM listener this instance added. */
    private readonly unbinders: Array<() => void> = [];

    /**
     * @param input the mobile input flags the buttons should drive
     * @param scene the scene that owns this input; its shutdown unbinds the DOM
     */
    constructor(input: MobileInput, scene: Phaser.Scene) {
        this.input = input;

        /*
         * Binds the HTML buttons to the corresponding MobileInput flags.
         */
        this.bindButton('left');
        this.bindButton('right');
        this.bindButton('jump');
        this.bindButton('interact');
        this.bindButton('settings');

        scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.unbind());
    }

    /**
     * Binds an input flag to the HTML button with the same id.
     * Pressing the button sets the flag to true; releasing sets it to false.
     * @param key the MobileInput flag (and button id) to bind, e.g. "left"
     */
    private bindButton(key: keyof MobileInput) {
        // Each MobileInput flag has a matching button id in index.html
        // (e.g. "left" flag -> <button id="left">).
        const button = document.getElementById(key);

        // If the button is not found, return early
        if (!button) return;

        // Prevents default browser behaviors and sets input to true when the button is pressed
        const press = (e: Event) => {
            e.preventDefault();
            this.input[key] = true;
        };

        // Shared method to set input to false when the button is released
        const release = () => {
            this.input[key] = false;
        };

        /*
         * Event listeners for pointer press and release (up, leave, or cancel).
         */
        button.addEventListener('pointerdown', press);
        button.addEventListener('pointerup', release);
        button.addEventListener('pointerleave', release);
        button.addEventListener('pointercancel', release);

        this.unbinders.push(() => {
            button.removeEventListener('pointerdown', press);
            button.removeEventListener('pointerup', release);
            button.removeEventListener('pointerleave', release);
            button.removeEventListener('pointercancel', release);
        });
    }

    /** Removes every DOM listener this instance added. */
    private unbind(): void {
        for (const unbind of this.unbinders) {
            unbind();
        }
        this.unbinders.length = 0;
    }
}
