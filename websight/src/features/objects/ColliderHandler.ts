import Phaser from 'phaser';

/**
 * The single place where interactable physics wiring happens.
 * Scenes never call `physics.add.collider` or position objects by hand;
 * spawn() factories go through this handler instead.
 */
export class ColliderHandler {
    /**
     * Collides the object with the scene's platforms.
     * @param obj the physics-enabled object to wire
     * @param platforms the platforms group or sprite to collide with
     * @returns the collider, for advanced use (e.g. process callbacks)
     */
    static withPlatforms(
        obj: Phaser.Physics.Arcade.Sprite,
        platforms: Phaser.GameObjects.Group | Phaser.Physics.Arcade.Sprite,
    ): Phaser.Physics.Arcade.Collider {
        return obj.scene.physics.add.collider(obj, platforms);
    }

    /**
     * Bottom-aligns the object with the ground surface and syncs its physics body.
     * @param obj the physics-enabled object to place
     * @param groundTopY the Y coordinate of the ground's top surface
     */
    static placeOnGround(
        obj: Phaser.Physics.Arcade.Sprite,
        groundTopY: number,
    ): void {
        Phaser.Display.Bounds.SetBottom(obj, groundTopY);

        const body = obj.body as Phaser.Physics.Arcade.Body;
        body.updateFromGameObject();
    }
}
