import Phaser from 'phaser';
import { Depth } from '../../../core/config/GameConfig';
import { Player } from '../../player/Player';
import { Interactable } from '../Interactable';
import { InteractableConfig } from '../../../core/config/InteractableConfig';

export class SwitchSceneInteractable extends Interactable {
    private switchScene: string;

    constructor(
        scene: Phaser.Scene,
        switchScene: string,
        player: Player,
        asset: string,
        x?: number,
        y?: number,
        scale?: number,
        interactionRadius?: number,
    ) {
        super(
            scene,
            player,
            x ?? 0,
            y ?? 0,
            asset,
            scale ?? 1,
            1,
            interactionRadius ?? InteractableConfig.RADIUS,
        );
        this.switchScene = switchScene;
        this.setDepth(Depth.BEHIND_PLAYER);
        this.on(Phaser.Input.Events.POINTER_DOWN, () => this.onInteract());
    }

    onInteract(): void {
        this.scene.scene.switch(this.switchScene);
    }
}
