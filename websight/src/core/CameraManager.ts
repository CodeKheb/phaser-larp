import Phaser from 'phaser';
import { WorldConfig } from './config/GameConfig';

/** Simple flag so scenes can query whether the camera should use mobile settings. */
export function isMobile(): boolean {
    return window.matchMedia('(pointer: coarse)').matches;
}

/**
 * Thin wrapper around a Phaser camera that applies the mobile/desktop zoom
 * settings in one place.
 *
 * MainScene uses follow mode (camera follows the player), so it needs the
 * mobile Y follow offset. HouseScene and MenuScene are buffer-centered rather
 * than follow-based, so they just get zoomed to fill the viewport.
 */
export class CameraManager {
    private readonly camera: Phaser.Cameras.Scene2D.Camera;

    /** Whether this camera was configured for mobile follow mode. */
    private readonly mobileFollow: boolean;

    constructor(camera: Phaser.Cameras.Scene2D.Camera, options?: { mobileFollow?: boolean }) {
        this.camera = camera;
        options = options ?? {};

        const mobile = isMobile();
        this.mobileFollow = !!options.mobileFollow && mobile;

        const zoom = mobile ? WorldConfig.MOBILE_ZOOM : WorldConfig.ZOOM_AMOUNT;
        camera.setZoom(zoom);

        if (this.mobileFollow) {
            camera.setFollowOffset(0, WorldConfig.MOBILE_ZOOM_OFFSET);
        }
    }

    /**
     * Set up follow on this camera, e.g. for a player.
     *
     * This is the follow-mode path used by MainScene and HouseScene.
     */
    startFollow(sprite: Phaser.GameObjects.GameObject): void {
        this.camera.startFollow(sprite);
    }

    /**
     * The point in world units that sits at the center of the buffer viewport.
     *
     * Phaser world coordinates are unzoomed buffer pixels, so `camera.width / 2`
     * is the center regardless of zoom level. This keeps centered-scenes (House,
     * Menu) pixel-correct for both desktop and mobile as long as the camera
     * isn't following anything.
     */
    viewportCenterX(): number {
        return this.camera.width / 2;
    }

    viewportCenterY(): number {
        return this.camera.height / 2;
    }

    /** Camera pixel width in world (unzoomed) units. */
    width(): number {
        return this.camera.width;
    }

    /** Camera pixel height in world (unzoomed) units. */
    height(): number {
        return this.camera.height;
    }

    /** Return the underlying Phaser camera (useful for bounds / follow). */
    cameraRef(): Phaser.Cameras.Scene2D.Camera {
        return this.camera;
    }
}
