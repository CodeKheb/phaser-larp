import Phaser from 'phaser';

export class KeyboardInput {
    private leftKey: Phaser.Input.Keyboard.Key;
    private rightKey: Phaser.Input.Keyboard.Key;
    private jumpKey: Phaser.Input.Keyboard.Key;
    private interactKey: Phaser.Input.Keyboard.Key;
    private escapeKey: Phaser.Input.Keyboard.Key;

    /**
     * assigns movement keys to the keyboard.
     * @param scene the game scene
     */
    constructor(scene: Phaser.Scene) {
        this.leftKey = scene.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.A,
        );

        this.rightKey = scene.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.D,
        );

        this.jumpKey = scene.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE,
        );

        this.interactKey = scene.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.Q,
        );

        this.escapeKey = scene.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC,
        );
    }

    get left() {
        return this.leftKey.isDown;
    }

    get right() {
        return this.rightKey.isDown;
    }

    get jump() {
        return this.jumpKey.isDown;
    }

    get escape() {
        return this.escapeKey.isDown;
    }

    get interact() {
        return Phaser.Input.Keyboard.JustDown(this.interactKey);
    }
}
