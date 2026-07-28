import { WorldConfig } from "../../core/config/GameConfig";
import { Assets } from "../../shared/Assets";
import { Player } from "../player/Player";

export class Interactable extends Phaser.Physics.Arcade.Sprite{
    private clicked: boolean = false
    private player: Player

    constructor(scene: Phaser.Scene, player: Player) {
        super(scene, player.currentPosition().x + 50, player.currentPosition().y,  Assets.STAFF)
        this.setCollideWorldBounds(true)
        this.player = player
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
        if (this.clicked) {
            let playerCoordinates = this.player.currentPosition()
            this.setX(playerCoordinates.x)
            this.setY(playerCoordinates.y)
        }
    }
    
}