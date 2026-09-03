import Phaser from "phaser";

/**
 * Represents the menu mage scene.
 * Handles the buttons and routes to Scene
 * It is initialized, loaded first by the Phaser game
 *
 * referenved by main.ts as the first scene
 */
export class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }

    /**
     * creates the text and buttons
     */
    create(): void {
        const CENTER_X = this.cameras.main.width / 2;
        const CENTER_Y = this.cameras.main.height / 2;

        this.add.text(CENTER_X, CENTER_Y - 80, "WebSight", {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.createButton(CENTER_X, CENTER_Y, 'PLAY', () => {
            this.scene.start('MainScene');

        })

    }

    /**
     * @param x as x coordinate
     * @param y as y coordinate
     * @param label as text content
     * @param onClick as the click handler
     */
    private createButton(x: number, y: number, label: string, onClick: () => void): void {
        const button = this.add.text(x, y, label, {
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 },
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        button.on('pointerover', () => button.setStyle({ backgroundColor: '#555555' }));
        button.on('pointerout', () => button.setStyle({ backgroundColor: '#333333' }));
        button.on('pointerdown', onClick);
    }
}
