import Phaser from "phaser";
import { Interactable } from "../Interactable";
import { Player } from "../../player/Player";
import { Assets } from "../../../shared/Assets";
import { Depth, WorldConfig } from "../../../core/config/GameConfig";

/**
 * An interactable that displays a cube.
 * When the player is near, the cube glow, when the player interacts with it, it spawns a new one.
 */
export class CubeInteractable extends Interactable {
  private glowSprite!: Phaser.GameObjects.Sprite; // Sprite for the cube glow
  private glowTween!: Phaser.Tweens.Tween; // The animation (tween means in-between)

  /**
   * @param scene the game scene
   * @param player the player object
   * @param x spawn X
   * @param y spawn Y
   */

  constructor(scene: Phaser.Scene, player: Player, x: number, y: number) {
    super(scene, player, x, y, Assets.CUBE);
    this.setScale(0.35);
    this.setDepth(Depth.BEHIND_PLAYER);

    this.setUpGlow();

    this.on(Phaser.Input.Events.POINTER_DOWN, () => this.onInteract());
  }

  /**
   * This method is called in MainScene and adds the cubes in a random position
   * Once a cube is destroyed, it spawns a new one
   *
   * @param Phaser.scene
   * @param player the player object
   * @param platforms the collidable Physics component
   */
  static spawn(
    scene: Phaser.Scene,
    player: Player,
    platforms: Phaser.GameObjects.Group | Phaser.Physics.Arcade.Sprite,
  ): CubeInteractable {
    const x = Phaser.Math.Between(
      WorldConfig.WORLD_WIDTH - 3500,
      WorldConfig.WORLD_WIDTH - 5500,
    );

    const y = WorldConfig.GROUND_Y - 1000;

    const cube = new CubeInteractable(scene, player, x, y);

    scene.physics.add.existing(cube);

    cube.body!.setOffset(30, 30);
    scene.physics.add.collider(cube, platforms);

    cube.once(Phaser.GameObjects.Events.DESTROY, () => {
      CubeInteractable.spawn(scene, player, platforms);
    });

    return cube;
  }

  /**
   * This method creates the glowSprite and sets up glowTween
   */
  private setUpGlow(): void {
    this.glowSprite = this.scene.add.sprite(this.x, this.y, Assets.CUBE);
    this.glowSprite.setScale(this.scaleX * 1.1);
    this.glowSprite.setDepth(this.depth - 1);
    this.glowSprite.setTint(0xffffff);
    this.glowSprite.setAlpha(0.6);

    // Initially not visible
    this.glowSprite.setVisible(false);

    this.glowSprite.setDepth(Depth.BEHIND_PLAYER);

    // The tween(animation)
    this.glowTween = this.scene.tweens.add({
      targets: this.glowSprite,
      scaleX: this.scaleX * 1.25,
      scaleY: this.scaleY * 1.25,
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

  // destroy cube after player interacts with it
  onInteract(): void {
    this.destroy();
  }
}
