/**
 * Centralized scene keys.
 *
 * Every scene key is defined here so callers never use bare strings like
 * `'MainScene'` across the codebase. When a new scene is added to Main.ts,
 * add its key here too.
 */
export const SceneKeys = {
    Menu: 'MenuScene',
    Main: 'MainScene',
    House: 'HouseScene',
} as const;

export type SceneKey = (typeof SceneKeys)[keyof typeof SceneKeys];