import { Assets } from "../../shared/Assets";
import { Player } from "../player/Player";
import Phaser from "phaser";

export class Interactable extends Phaser.Physics.Arcade.Sprite {
    private static registry: Set<Interactable> = new Set();

    private clicked: boolean = false;
    private player: Player;
    private canInteract: boolean = false;
    private readonly interactionRadius: number = 120;

    constructor(scene: Phaser.Scene, player: Player) {
        super(scene, player.currentPosition().x + 50, player.currentPosition().y, Assets.STAFF);
        this.player = player;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setVisible(true);
        this.setActive(true);

        this.setInteractive({ useHandCursor: true });
        this.input!.enabled = false;

        this.on(Phaser.Input.Events.POINTER_DOWN, () => this.toggleClicked());
        this.on(Phaser.Input.Events.POINTER_OVER, () => this.setTint(0xffff66));
        this.on(Phaser.Input.Events.POINTER_OUT, () => this.clearTint());


        Interactable.registry.add(this);
    }

    static getInRange(): Interactable[] {
        return [...Interactable.registry].filter((i) => i.interactState);
    }

    destroy(fromScene?: boolean): void {
        Interactable.registry.delete(this);
        super.destroy(fromScene);
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        this.updateProximity();
        this.followPlayerIfHeld();
    }

    private updateProximity(): void {
        const inRange = Phaser.Math.Distance.Between(
            this.x, this.y,
            this.player.currentPosition().x, this.player.currentPosition().y
        ) <= this.interactionRadius;

        if (inRange !== this.canInteract) {
            this.canInteract = inRange;
            this.input!.enabled = inRange;
            if (!inRange) this.clearTint();
        }
    }

    private followPlayerIfHeld(): void {
        if (!this.isClicked) {
            this.setVelocityX(0);
            return;
        }
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        this.setVelocityX(body.velocity.x);
        this.setVelocityY(body.velocity.y);
        this.setFlipX(this.player.flipX);
    }

    get interactState(): boolean {
        return this.canInteract;
    }

    toggleClicked(): void {
        this.clicked = !this.clicked;
    }

    get isClicked(): boolean {
        return this.canInteract && this.clicked;
    }
}
