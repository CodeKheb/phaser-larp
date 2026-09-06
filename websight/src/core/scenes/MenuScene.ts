import Phaser from 'phaser';
import { InputManager } from '../../features/controls/InputManager';
import { SceneKeys } from '../config/SceneKeys';

/**
 * Represents the menu scene.
 * Handles the play button and routes to the game scene.
 * It is initialized and loaded first by the Phaser game.
 *
 * Referenced by Main.ts as the first scene.
 */
export class MenuScene extends Phaser.Scene {
    private controls!: InputManager;

    constructor() {
        super(SceneKeys.Menu);
    }

    /**
     * Creates the title text and play button.
     */
    create(): void {
        this.controls = new InputManager(this);

        const CENTER_X = this.cameras.main.width / 2;
        const CENTER_Y = this.cameras.main.height / 2;

        this.add
            .text(CENTER_X, CENTER_Y - 180, 'WebSight', {
                fontFamily: 'Arial, sans-serif',
                fontStyle: 'bold',
                fontSize: '78px',
                color: '#ffffff',
                stroke: '#0b1d26',
            })
            .setOrigin(0.5)
            .setShadow(0, 4, '#00000066', 6, false, true);

        this.createButton(CENTER_X, CENTER_Y, 'PLAY', () => {
            if (this.scene.isPaused(SceneKeys.House)) {
                this.scene.resume(SceneKeys.House);
                this.scene.stop();
            } else if (this.scene.isPaused(SceneKeys.Main)) {
                this.scene.resume(SceneKeys.Main);
                this.scene.stop();
            } else {
                this.scene.start(SceneKeys.Main);
            }
        });

        // Add class to hide mobile controls while menu is active
        document.body.classList.add('menu-active');
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            document.body.classList.remove('menu-active');
        });
    }

    // If escape is pressed, resume the paused scene (House or Main).
    update(): void {
        const escapePressed = this.controls.escape;

        if (escapePressed && this.scene.isPaused(SceneKeys.House)) {
            this.scene.stop();
            this.scene.resume(SceneKeys.House);
        }
        if (escapePressed && this.scene.isPaused(SceneKeys.Main)) {
            this.scene.stop();
            this.scene.resume(SceneKeys.Main);
        }
    }

    /**
     * @param x The x coordinate for the button center.
     * @param y The y coordinate for the button center.
     * @param label The button label text.
     * @param onClick The handler to call when the button is released.
     */
    private createButton(
        x: number,
        y: number,
        label: string,
        onClick: () => void,
    ): void {
        const button = this.add
            .text(x, y, label, {
                fontFamily: 'Arial, sans-serif',
                fontSize: '58px',
                color: '#ffffff',
                backgroundColor: '#1d4ed8',
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setShadow(0, 4, '#00000066', 4, false, true);

        button.on('pointerover', () => {
            button.setStyle({ backgroundColor: '#2563eb' });
            this.tweens.add({
                targets: button,
                scale: 1.05,
                duration: 100,
            });
        });
        button.on('pointerout', () => {
            button.setStyle({ backgroundColor: '#1d4ed8' });
            this.tweens.add({
                targets: button,
                scale: 1,
                duration: 100,
            });
        });
        button.on('pointerdown', () => {
            this.tweens.add({
                targets: button,
                scale: 0.95,
                duration: 60,
            });
        });
        button.on('pointerup', () => {
            this.tweens.add({
                targets: button,
                scale: 1.05,
                duration: 60,
            });
            onClick();
        });
    }
}
