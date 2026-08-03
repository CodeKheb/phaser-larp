import { Assets } from "../../shared/Assets";
import { Player } from "../player/Player";
import Phaser from "phaser";

export class Interactable extends Phaser.Physics.Arcade.Sprite {
    private clicked: boolean = false;
    //private player: Player;
    readonly interactionZone: Phaser.GameObjects.Zone;
    private canInteract: boolean = false;
    private readonly interactionRadius: number = 120;

    constructor(scene: Phaser.Scene, player: Player) {
        super(scene, player.currentPosition().x + 50, player.currentPosition().y, Assets.STAFF);
        //this.player = player;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setVisible(true);
        this.setActive(true);

        this.interactionZone = scene.add.zone(
            this.x,
            this.y,
            this.interactionRadius * 2,
            this.interactionRadius * 2
        );
        scene.physics.add.existing(this.interactionZone, true);
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        if (!this.clicked) {
            this.setVelocityX(0)
        }

        this.interactionZone.setPosition(this.x, this.y);
        const zoneBody = this.interactionZone.body as Phaser.Physics.Arcade.StaticBody | undefined;
        if (zoneBody) {
            zoneBody.updateFromGameObject();
        }
    }

    get interactState(): boolean {
        return this.canInteract;
    }

    setCanInteract(state: boolean) {
        this.canInteract = state;
    }

    toggleClicked() {
        this.clicked = !this.clicked;
    }

    get isClicked(): boolean {
        return this.canInteract && this.clicked;
    }
}