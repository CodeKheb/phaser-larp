/**
 * Asset key constants for use with Phaser's texture loader and sprite creation.
 * Each key maps to a texture name used in the game.
 */
export const Assets = {
    CHARACTER: 'character',
    PLATFORM: 'ground',
    LOGO: 'logo',
    STAFF: 'staff',
    CLOUD: 'cloud',
    SIGN: 'sign',
    CUBE: 'cube',
    BOX: 'box',
    HOUSE: 'house',
    HOUSE_SCENE: 'house_scene',
} as const;

/**
 * File paths for each asset. Maps asset keys to their source image files.
 */
export const AssetPaths = {
    CHARACTER: 'player/player.png',
    PLATFORM: 'world/platform.png',
    LOGO: 'world/logo.png',
    STAFF: 'objects/staff.png',
    CLOUD: 'world/clouds.png',
    SIGN: 'objects/sign.png',
    CUBE: 'objects/cube.png',
    BOX: 'objects/wooden_box.png',
    HOUSE: 'world/house.png',
    HOUSE_SCENE: 'scenes/house_scene.png',
} as const;
