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
         * Binds the HTML buttons to the corresponding MobileInput flags.
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

        // Prevents default browser behaviors and sets input to true when the button is pressed
        button.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            this.input[key] = true;
        });

        // Shared method to set input to false when the button is released
        const release = () => {
            this.input[key] = false;
        };

        /*
         * Event listeners for pointer release (up, leave, or cancel).
         */
        button.addEventListener('pointerup', release);
        button.addEventListener('pointerleave', release);
        button.addEventListener('pointercancel', release);
    }
}
