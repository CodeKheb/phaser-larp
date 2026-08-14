import { Assets } from "../../shared/Assets";
import { Player } from "../player/Player";
import Phaser from "phaser";

/**
 * Represents an interactable object in the game.
 * This class extends Phaser.Physics.Arcade.Sprite and adds functionality for interacting with the player.
 * <br>
 * This exact class is used for interaction specifically "holding" an object.
 */
export class Interactable extends Phaser.Physics.Arcade.Sprite {
    private static registry: Set<Interactable> = new Set();

    private clicked: boolean = false;
    private player: Player;
    private canInteract: boolean = false;
    private readonly interactionRadius: number = 120;

    /**
     * creates a new interactable object at the player's position.'
     * @param scene the game scene
     * @param player the player object that interacts with this object
     */
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

        // Centralized event handling for interaction
        this.on(Phaser.Input.Events.POINTER_DOWN, () => this.toggleClicked());
        this.on(Phaser.Input.Events.POINTER_OVER, () => this.setTint(0xffff66));
        this.on(Phaser.Input.Events.POINTER_OUT, () => this.clearTint());


        Interactable.registry.add(this);
    }

    /**
     * gives you a list of all interactable objects that are
     * currently close enough or otherwise valid for interaction.
     */
    static getInRange(): Interactable[] {
        return [...Interactable.registry].filter((i) => i.interactState);
    }

    destroy(fromScene?: boolean): void {
        Interactable.registry.delete(this);
        super.destroy(fromScene);
    }

    /**
     * updates the interactable object's proximity to the player and
     * follows the player's movement if the object is held.
     *
     * @param time current internal game timestamp
     * @param delta time elapsed since last update
     */
    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        this.updateProximity();
        this.followPlayerIfHeld();
    }

    /**
     * updates the interactable object's proximity to the player.
     * If the player is within the interaction radius, the object
     * will be interactable.
     */
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

    /**
     * follows the player's movement if the object is held.
     */
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
