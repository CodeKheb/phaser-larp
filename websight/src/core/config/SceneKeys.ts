/**
 * Centralized scene key constants.
 *
 * Every scene has a key defined here so callers can use typed references
 * instead of bare strings like `'MainScene'`. When a new scene is added to
 * Main.ts, add its key to this object.
 */
export const SceneKeys = {
    Menu: 'MenuScene',
    Main: 'MainScene',
    House: 'HouseScene',
} as const;

/**
 * Type for scene key values. Use this for parameters that accept scene keys.
 */
export type SceneKey = (typeof SceneKeys)[keyof typeof SceneKeys];
