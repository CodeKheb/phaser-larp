import Phaser from 'phaser';
import { Depth } from '../../../core/config/GameConfig';
import { Player } from '../../player/Player';
import { Interactable, type InteractableOptions } from '../Interactable';
import { SceneManager } from '../../../core/scenes/SceneManager';
import type { SceneKey } from '../../../core/config/SceneKeys';

/**
 * Configuration for creating a scene-switching interactable.
 * Extends {@link InteractableOptions} with the scene to switch to.
 */
export interface SwitchSceneInteractableOptions extends InteractableOptions {
    /** The key of the scene to switch to when interacted with. */
    targetScene: SceneKey;
}

export class SwitchSceneInteractable extends Interactable {
    private targetScene: SceneKey;

    /**
     * @param scene the game scene
     * @param player the player object
     * @param options configuration for this scene-switching object (must include targetScene)
     */
    constructor(
        scene: Phaser.Scene,
        player: Player,
        options: SwitchSceneInteractableOptions,
    ) {
        super(scene, player, {
            ...options,
            innerGlowIntensity: 1, // glow effect so the exit is noticeable
        });
        this.targetScene = options.targetScene;
        this.setDepth(Depth.BEHIND_PLAYER);
        this.on(Phaser.Input.Events.POINTER_DOWN, () => this.onInteract());
    }

    /**
     * Spawns a scene-switching object wired to the scene's platforms and ground.
     * @param scene the game scene
     * @param options configuration for this scene-switching object (must include targetScene)
     */
    static spawn(
        scene: Phaser.Scene,
        options: SwitchSceneInteractableOptions,
    ): SwitchSceneInteractable {
        const context = Interactable.resolve(scene);

        return Interactable.finalizeSpawn(
            new SwitchSceneInteractable(scene, context.player, options),
            scene,
            options,
        );
    }

    onInteract(): void {
        // SceneManager defers the switch out of this input tick and guards
        // against concurrent transitions (raw scene.start is once-only).
        SceneManager.go(this.scene, this.targetScene);
    }
}
