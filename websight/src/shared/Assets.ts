/* manages:
 * 1. key/property name: unique identifier for the assets (e.g., Assets.CHARACTER)
 * 2. path: path to the asset (e.g., AssetPaths.CHARACTER)
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
} as const;

export const AssetPaths = {
    CHARACTER: 'player/player.png',
    PLATFORM: 'world/platform.png',
    LOGO: 'world/logo.png',
    STAFF: 'objects/staff.png',
    CLOUD: 'world/clouds.png',
    SIGN: 'objects/sign.png',
    CUBE: 'objects/cube.png',
    BOX: 'objects/wooden_box.png',
} as const;
