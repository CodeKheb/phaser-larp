/**
 * Global world layout and camera configuration
 */
export const WorldConfig = {
    WORLD_WIDTH: 8000,
    WORLD_HEIGHT: 1280,
    GROUND_Y: 2000, // Y-coordinate where the ground platform is placed
    LOGO_Y: 400, // Y-coordinate where the logo is placed
    CLOUD_Y: 600, // Y-coordinate where the clouds are placed
    CLOUD_SPEED: 0.02, // Cloud movement speed in pixels per millisecond
    ZOOM_AMOUNT: 0.55, // Amount of zoom used in the camera
    MOBILE_ZOOM: 0.35, // Amount of zoom used in mobile camera 
    MOBILE_ZOOM_OFFSET: 300 // Amount of offset on Y-coordinate
} as const;

/**
 * Global depth configuration
 */
export const Depth = {
    PLAYER: 10,
    ABOVE_PLAYER: 20,
    BEHIND_PLAYER: 5,
} as const;
