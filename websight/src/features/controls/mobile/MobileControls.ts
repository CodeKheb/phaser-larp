import { MobileInput } from './MobileInput';

/**
 * Connects HTML mobile control buttons to the game's input system.
 *
 * Button IDs are defined in index.html.
 */
export class MobileControls {
    private input: MobileInput;
    constructor(input: MobileInput) {
        this.input = input;

        /*
            Binds the buttons to the input objects in MobileInput.
         */
        this.bindButton('left');
        this.bindButton('right');
        this.bindButton('jump');
        this.bindButton('interact');
        this.bindButton('settings');
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

        // Prevents default browser behaviors and assigns input as true if the button is pressed
        button.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            this.input[key] = true;
        });

        // Shared method to assign input as false when the button is released
        const release = () => {
            this.input[key] = false;
        };

        /*
            Event listeners for cases where the button is released.
         */
        button.addEventListener('pointerup', release);
        button.addEventListener('pointerleave', release);
        button.addEventListener('pointercancel', release);
    }
}
