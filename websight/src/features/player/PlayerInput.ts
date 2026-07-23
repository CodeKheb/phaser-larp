import Phaser from "phaser";

export class PlayerInput {

    private leftKey!: Phaser.Input.Keyboard.Key;
    private rightKey!: Phaser.Input.Keyboard.Key;
    private jumpKey!: Phaser.Input.Keyboard.Key;

    constructor(scene: Phaser.Scene) {
        this.leftKey = scene.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.A
        );

        this.rightKey = scene.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.D
        );

        this.jumpKey = scene.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
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
}
