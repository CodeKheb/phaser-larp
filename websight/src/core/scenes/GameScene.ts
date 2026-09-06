import Phaser from 'phaser';
import { Player } from '../../features/player/Player';
import { InputManager } from '../../features/controls/InputManager';

/**
 * Base class for scenes where the player is controlled directly (gameplay scenes).
 *
 * Handles the parts that every gameplay scene shares:
 * - creating the player and input manager
 * - movement, jumping, and interaction controls
 * - pausing the game and opening the menu with Escape
 *
 * Subclasses only need to build their own world in create() and can hook
 * per-frame logic through {@link updateScene}.
 */
export abstract class GameScene extends Phaser.Scene {
    protected player!: Player;
    protected controls!: InputManager;

    /**
     * Creates the player and input manager.
     * Call this from create() so the controls work in this scene.
     * @param x player spawn X (defaults to the Player's default)
     * @param y player spawn Y (defaults to the Player's default)
     */
    protected setupPlayer(x?: number, y?: number): void {
        this.player = new Player(this, x, y);
        this.controls = new InputManager(this);
    }

    /**
     * Runs every frame: first the subclass hook, then the shared player controls.
     * Subclasses override {@link updateScene} for their own per-frame logic,
     * or override update() entirely and call super.update(time, delta).
     */
    update(_time: number, delta: number): void {
        this.updateScene(delta);
        this.handlePlayerControls();
        this.handlePauseMenu();
    }

    /**
     * Hook for subclasses to update their own per-frame logic (e.g. the world).
     */
    protected updateScene(_delta: number): void {}

    /**
     * Movement, jumping, and interaction, read from the shared InputManager.
     */
    private handlePlayerControls(): void {
        if (this.controls.left) this.player.moveLeft();
        else if (this.controls.right) this.player.moveRight();
        else this.player.stopPlayer();

        if (this.controls.jump) this.player.jump();

        if (this.controls.interact) {
            this.player.toggleInteractable();
        }
    }

    /**
     * Opens the menu by pausing this scene and launching the MenuScene on top.
     * MenuScene is responsible for resuming whichever scene paused it.
     */
    private handlePauseMenu(): void {
        if (!this.controls.escape) return;

        this.scene.pause();
        this.scene.launch('MenuScene');
        this.scene.bringToTop('MenuScene');
    }
}
