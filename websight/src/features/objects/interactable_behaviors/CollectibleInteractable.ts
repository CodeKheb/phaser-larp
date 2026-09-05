import Phaser from 'phaser';
import { Interactable } from '../Interactable';
import { Player } from '../../player/Player';
import { Depth, WorldConfig } from '../../../core/config/GameConfig';

/**
 * An interactable that displays a collectible.
 * When the player is near, the collectible glow, when the player interacts with it, it spawns a new one.
 */
export class CollectibleInteractable extends Interactable {
    private glowSprite!: Phaser.GameObjects.Sprite; // Sprite for the collectible glow
    private glowTween!: Phaser.Tweens.Tween; // The animation (tween means in-between)

    private readonly collectibleTexture: string;
    private readonly collectibleScale: number;

    /**
     * @param scene the game scene
     * @param player the player object
     * @param x spawn X
     * @param y spawn Y
     * @param texture the sprite asset
     * @param scale for scale of asset
     */
    constructor(
        scene: Phaser.Scene,
        player: Player,
        x: number,
        y: number,
        texture: string,
        scale = 0.35,
    ) {
        super(scene, player, x, y, texture);

        this.collectibleTexture = texture;
        this.collectibleScale = scale;

        this.setScale(0.35);
        this.setDepth(Depth.BEHIND_PLAYER);

        this.setUpGlow();

        this.on(Phaser.Input.Events.POINTER_DOWN, () => this.onInteract());
    }

    /**
     * This method is called in MainScene and adds the collectible in a random position
     * Once a collectible is destroyed, it spawns a new one
     *
     * @param Phaser.scene
     * @param player the player object
     * @param platforms the collidable Physics component
     * @param texture the Sprite Asset
     * @param spawnRate delay for spawn after destroy
     * @param scale for scale of asset
     */
    static spawn(
        scene: Phaser.Scene,
        player: Player,
        platforms: Phaser.GameObjects.Group | Phaser.Physics.Arcade.Sprite,
        texture: string,
        spawnRate: number,
        scale = 0.35,
    ): CollectibleInteractable {
        const x = Phaser.Math.Between(
            WorldConfig.WORLD_WIDTH - 3500,
            WorldConfig.WORLD_WIDTH - 5500,
        );

        const y = WorldConfig.GROUND_Y - 1000;

        const collectible = new CollectibleInteractable(
            scene,
            player,
            x,
            y,
            texture,
            scale,
        );

        scene.physics.add.existing(collectible);

        collectible.body!.setOffset(30, 30);
        scene.physics.add.collider(collectible, platforms);

        collectible.once(Phaser.GameObjects.Events.DESTROY, () => {
            scene.time.delayedCall(spawnRate, () => {
                CollectibleInteractable.spawn(
                    scene,
                    player,
                    platforms,
                    texture,
                    spawnRate,
                    scale,
                );
            });
        });

        return collectible;
    }

    /**
     * This method creates the glowSprite and sets up glowTween
     */
    private setUpGlow(): void {
        this.glowSprite = this.scene.add.sprite(
            this.x,
            this.y,
            this.collectibleTexture,
        );
        this.glowSprite.setScale(this.scale * 1.1);
        this.glowSprite.setDepth(this.depth - 1);
        this.glowSprite.setTint(0xffffff);
        this.glowSprite.setAlpha(0.6);

        // Initially not visible
        this.glowSprite.setVisible(false);

        this.glowSprite.setDepth(Depth.BEHIND_PLAYER);

        // The tween(animation)
        this.glowTween = this.scene.tweens.add({
            targets: this.glowSprite,
            scaleX: this.collectibleScale * 1.25,
            scaleY: this.collectibleScale * 1.25,
            alpha: 0.8,
            duration: 250,
            yoyo: true,
            repeat: -1,
            ease: Phaser.Math.Easing.Sine.InOut,
        });

        // pause the tween
        this.glowTween.pause();

        // bind listener to updateListener for removal later
        const updateListener = () => {
            if (this.active && this.glowSprite && this.glowSprite.active) {
                this.glowSprite.setPosition(this.x, this.y);
            }
        };

        this.scene.events.on(Phaser.Scenes.Events.UPDATE, updateListener);

        // Clean up the glowSprite and glowTween on DESTROY
        this.on(Phaser.GameObjects.Events.DESTROY, () => {
            this.scene.events.off(Phaser.Scenes.Events.UPDATE, updateListener);
            if (this.glowTween) this.glowTween.remove();
            if (this.glowSprite) this.glowSprite.destroy();
        });
    }

    /**
     * if player is in range, set glow to true
     */
    onInRange(): void {
        if (this.glowSprite && this.glowSprite.active && this.glowTween) {
            this.glowSprite.setVisible(true);
            this.glowTween.resume();
        }
    }

    /**
     * if player is not in range, set glow to false
     */
    onOutOfRange(): void {
        if (this.glowSprite && this.glowSprite && this.glowTween) {
            this.glowSprite.setVisible(false);
            this.glowTween.restart();
            this.glowTween.pause();
        }
    }

    // destroy collectible after player interacts with it
    onInteract(): void {
        this.destroy();
    }
}
