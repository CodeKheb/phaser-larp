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
        this.bind('left', 'left');
        this.bind('right', 'right');
        this.bind('jump', 'jump');
        this.bind('interact', 'interact');
        this.bind('settings', 'settings');
    }

    /**
     * binds a button to a key in the input object.
     * @param id the id of the button (e.g., "left", "right")
     * @param key the key in the input object to bind to
     */
    private bind(
        id: 'left' | 'right' | 'jump' | 'interact' | 'settings',
        key: keyof MobileInput,
    ) {
        // Declares a button element with the given id in the parameter
        const button = document.getElementById(id);

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
