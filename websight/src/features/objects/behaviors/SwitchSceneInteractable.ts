import Phaser from 'phaser';
import { Depth } from '../../../core/config/GameConfig';
import { Player } from '../../player/Player';
import { Interactable, type InteractableOptions } from '../Interactable';

/**
 * Configuration for creating a scene-switching interactable.
 * Extends {@link InteractableOptions} with the scene to switch to.
 */
export interface SwitchSceneInteractableOptions extends InteractableOptions {
    /** The key of the scene to switch to when interacted with. */
    targetScene: string;
}

export class SwitchSceneInteractable extends Interactable {
    private targetScene: string;

    /**
     * @param scene the game scene
     * @param player the player object
     * @param options configuration for this scene-switching object
     */
    constructor(
        scene: Phaser.Scene,
        player: Player,
        options: SwitchSceneInteractableOptions,
    ) {
        super(scene, player, {
            ...options,
            glowStrength: 1, // subtle glow so the exit is noticeable
        });
        this.targetScene = options.targetScene;
        this.setDepth(Depth.BEHIND_PLAYER);
        this.on(Phaser.Input.Events.POINTER_DOWN, () => this.onInteract());
    }

    onInteract(): void {
        this.scene.scene.switch(this.targetScene);
    }
}
