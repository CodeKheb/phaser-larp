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

    onInteract(): void {
        const currentKey = this.scene.scene.key;
        const targetKey = this.targetScene;
        
        // Sleep scene
        this.scene.scene.sleep(currentKey);
        
        // Wake or start target scene
        const target = this.scene.scene.get(targetKey);
        if (target && target.scene.isSleeping()) {
            // Target was sleeping - wake it (no restart!)
            this.scene.scene.wake(targetKey);
        } else {
            // Target was stopped or never started - start it
            this.scene.scene.start(targetKey);
        }
        
        // Bring target to top
        this.scene.scene.switch(targetKey);
    }
}
