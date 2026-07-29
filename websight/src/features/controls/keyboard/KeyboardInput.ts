import Phaser from "phaser";

export class KeyboardInput {
    private leftKey: Phaser.Input.Keyboard.Key;
    private rightKey: Phaser.Input.Keyboard.Key;
    private jumpKey: Phaser.Input.Keyboard.Key;
    private interactKey: Phaser.Input.Keyboard.Key;

    constructor(scene: Phaser.Scene) {
        this.leftKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.rightKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.jumpKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.interactKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
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

    get interact() {
        return this.interactKey.isDown;
    }

    get interactJustPressed() {
        return Phaser.Input.Keyboard.JustDown(this.interactKey);
    }
}
