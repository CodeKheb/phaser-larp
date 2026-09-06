import Phaser from 'phaser';
import { Interactable, type InteractableOptions } from '../Interactable';
import { Player } from '../../player/Player';
import { Depth, WorldConfig } from '../../../core/config/GameConfig';

/**
 * An interactable that displays a collectible.
 * When the player is near, the collectible glows; when the player interacts with it, it spawns a new one.
 */
export class CollectibleInteractable extends Interactable {
    private glowSprite!: Phaser.GameObjects.Sprite; // Sprite for the collectible glow effect
    private glowTween!: Phaser.Tweens.Tween; // Tween animation (in-between frames)

    private readonly collectibleTexture: string;
    private readonly collectibleScale: number;

    /**
     * @param scene the game scene
     * @param player the player object
     * @param options configuration for this collectible object
     *                (scale defaults to 0.35)
     */
    constructor(
        scene: Phaser.Scene,
        player: Player,
        options: InteractableOptions,
    ) {
        super(scene, player, { ...options, scale: options.scale ?? 0.35 });

        this.collectibleTexture = options.asset;
        this.collectibleScale = options.scale ?? 0.35;

        this.setDepth(Depth.BEHIND_PLAYER);

        this.setUpGlow();

        this.on(Phaser.Input.Events.POINTER_DOWN, () => this.onInteract());
    }

    /**
     * Spawns a collectible at a random position in the world.
     * Once destroyed, automatically spawns a new one after a delay.
     *
     * @param scene the game scene
     * @param player the player object
     * @param platforms the collidable physics group or sprite
     * @param texture the sprite asset key
     * @param spawnRate delay in ms before spawning a new collectible after destroy
     * @param scale for the collectible sprite scale
     */
    static spawn(
        scene: Phaser.Scene,
        player: Player,
        platforms: Phaser.GameObjects.Group | Phaser.Physics.Arcade.Sprite,
        texture: string,
        spawnRate: number,
        scale = 0.35,
    ): CollectibleInteractable {
        const spawnAreaMinX = WorldConfig.WORLD_WIDTH - 5500;
        const spawnAreaMaxX = WorldConfig.WORLD_WIDTH - 3500;

        const x = Phaser.Math.Between(spawnAreaMinX, spawnAreaMaxX);
        const y = WorldConfig.GROUND_Y - 5000;

        const collectible = new CollectibleInteractable(scene, player, {
            asset: texture,
            x,
            y,
            scale,
        });

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

        // The glow sprite sits above the player so the collectible itself (below the player)
        // is clearly visible when highlighted.
        this.glowSprite.setTint(0xffffff);
        this.glowSprite.setAlpha(0.6);

        // Initially not visible
        this.glowSprite.setVisible(false);

        this.glowSprite.setDepth(Depth.ABOVE_PLAYER);

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

        // Pause the tween initially
        this.glowTween.pause();

        // Bind update listener for position synchronization (removed on destroy)
        const updateListener = () => {
            if (this.active && this.glowSprite && this.glowSprite.active) {
                this.glowSprite.setPosition(this.x, this.y);
            }
        };

        this.scene.events.on(Phaser.Scenes.Events.UPDATE, updateListener);

        // Clean up glowSprite and glowTween when the collectible is destroyed
        this.on(Phaser.GameObjects.Events.DESTROY, () => {
            this.scene.events.off(Phaser.Scenes.Events.UPDATE, updateListener);
            if (this.glowTween) this.glowTween.remove();
            if (this.glowSprite) this.glowSprite.destroy();
        });
    }

    /**
     * Called when the player enters interaction range. Shows the glow effect.
     */
    onInRange(): void {
        if (this.glowSprite && this.glowSprite.active && this.glowTween) {
            this.glowSprite.setVisible(true);
            this.glowTween.resume();
        }
    }

    /**
     * Called when the player leaves interaction range. Hides the glow effect.
     */
    onOutOfRange(): void {
        if (this.glowSprite && this.glowSprite.active && this.glowTween) {
            this.glowSprite.setVisible(false);
            this.glowTween.pause();
        }
    }

    // Destroy the collectible after the player interacts with it
    onInteract(): void {
        this.destroy();
    }
}
