import Phaser from "phaser";
import { Interactable } from "../Interactable";
import { Player } from "../../player/Player";
import { Assets } from "../../../shared/Assets";
import { Depth, WorldConfig } from "../../../core/config/GameConfig";

export class CubeInteractable extends Interactable {
    private glowSprite!: Phaser.GameObjects.Sprite;
    private glowTween!: Phaser.Tweens.Tween;

    constructor(
        scene: Phaser.Scene,
        player: Player,
        x: number,
        y: number,
    ) {
        super(scene, player, x, y, Assets.CUBE)
        this.setScale(0.35)
        this.setDepth(Depth.BEHIND_PLAYER)

        this.setUpGlow();


        this.on(Phaser.Input.Events.POINTER_DOWN, () => this.onInteract());
    }


    static spawn(
        scene: Phaser.Scene,
        player: Player,
    ): CubeInteractable {
        const x = Phaser.Math.Between(
            WorldConfig.WORLD_WIDTH - 3500,
            WorldConfig.WORLD_WIDTH - 5500
        );

        const y = 1000;

        return new CubeInteractable(
            scene,
            player,
            x,
            y
        );
    }

    private setUpGlow(): void {
        this.glowSprite = this.scene.add.sprite(this.x, this.y, Assets.CUBE);
        this.glowSprite.setScale(this.scaleX * 1.1);
        this.glowSprite.setDepth(this.depth - 1);
        this.glowSprite.setTint(0xffffff);
        this.glowSprite.setAlpha(0.6);

        this.glowSprite.setVisible(false);

        this.glowTween = this.scene.tweens.add({
            targets: this.glowSprite,
            scaleX: this.scaleX * 1.25,
            scaleY: this.scaleY * 1.25,
            alpha: 0.8,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: Phaser.Math.Easing.Sine.InOut
        });

        this.glowTween.pause();

        this.scene.events.on(Phaser.Scenes.Events.UPDATE, () => {
            if (this.active && this.glowSprite) {
                this.glowSprite.setPosition(this.x, this.y);
            }
        });

        this.on(Phaser.GameObjects.Events.DESTROY, () => {
            if (this.glowSprite) this.glowSprite.destroy();
        });
    }

    onInRange(): void {
        if (this.glowSprite && this.glowTween) {
            this.glowSprite.setVisible(true);
            this.glowTween.resume();
        }
    }

    onOutOfRange(): void {
        if (this.glowSprite && this.glowTween) {
            this.glowSprite.setVisible(false);
            this.glowTween.pause();
        }
    }

    onInteract(): void {
        this.destroy();
    }
}
