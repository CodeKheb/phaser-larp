import Phaser from 'phaser';
import { Player } from '../../features/player/Player';
import { InputManager } from '../../features/controls/InputManager';
import type { InteractContext } from '../../features/objects/Interactable';
import { World } from '../../features/world/World';
import { SceneManager } from './SceneManager';

/**
 * Base class for scenes where the player is controlled directly (gameplay scenes).
 *
 * Handles the parts that every gameplay scene shares:
 * - creating the player and input manager
 * - movement, jumping, and interaction controls
 * - pausing the scene and launching the menu overlay with Escape
 *
 * Subclasses only need to build their own world in create() and can hook
 * per-frame logic through {@link updateScene}.
 */
export abstract class GameScene extends Phaser.Scene {
    protected world!: World;
    protected player!: Player;
    protected controls!: InputManager;

    /**
     * Scene-level context (player, platforms, ground position) that spawn()
     * factories resolve automatically. Subclasses with their own world setup
     * override this after building their world (see {@link HouseScene}).
     */
    interactContext!: InteractContext;

    /**
     * Creates the player and input manager.
     * Call this from create() so the controls work in this scene.
     * @param x player spawn X (defaults to the Player's default)
     * @param y player spawn Y (defaults to the Player's default)
     */
    protected setupPlayer(x?: number, y?: number): void {
        this.player = new Player(this, x, y);
        this.controls = new InputManager(this);

        // Default context points at the standard World; subclasses that build
        // their own platforms override it after setupPlayer() (see HouseScene).
        if (this.world) {
            this.interactContext = {
                player: this.player,
                platforms: this.world.platforms,
                groundTopY: this.world.groundTopY,
            };
        }
    }

    /**
     * Runs every frame: first the subclass hook, then player controls,
     * then pause menu handling. Subclasses override {@link updateScene} for
     * their own per-frame logic, or override update() entirely and call
     * super.update(time, delta).
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
     * Handles player movement, jumping, and interact toggle based on InputManager state.
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
     * Opens the menu by pausing this scene and launching MenuScene on top.
     * MenuScene handles resuming whichever scene paused it.
     */
    private handlePauseMenu(): void {
        if (!this.controls.escape) return;

        SceneManager.pauseForMenu(this);
    }
}
