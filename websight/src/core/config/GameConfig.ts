export const GRAVITY = 1800; // Vertical gravity applied to physics bodies
/**
 * Global world layout and camera configuration values.
 */
export const WorldConfig = {
    WORLD_WIDTH: 8000,
    WORLD_HEIGHT: 1280,
    GROUND_Y: 2000, // Y-coordinate of the ground platform
    LOGO_Y: 400, // Y-coordinate where the logo is placed
    CLOUD_AMOUNT: 20, // Number of clouds to spawn
    CLOUD_SPEED: 0.02, // Cloud scroll speed (multiplier for delta time)
    ZOOM_AMOUNT: 0.7, // Desktop camera zoom level
    MOBILE_ZOOM: 0.55, // Mobile camera zoom level
    MOBILE_ZOOM_OFFSET: 200, // Mobile camera Y-axis follow offset
} as const;

/**
 * Global depth configuration
 */
export const Depth = {
    PLAYER: 10,
    ABOVE_PLAYER: 20,
    BEHIND_PLAYER: 5,
} as const;
