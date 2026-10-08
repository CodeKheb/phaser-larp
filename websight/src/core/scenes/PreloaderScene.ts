import Phaser from 'phaser';
import { SceneKeys } from '../config/SceneKeys';
import { Assets, AssetPaths } from '../../shared/Assets';

/**
 * Boot scene: preloads every texture the game needs, then starts the menu.
 *
 * Referenced by Main.ts as the first scene, so it is the only scene Phaser
 * auto-starts. Loading here means gameplay scenes never run their own
 * loading phase when they first start or later switch — their textures are
 * already in the global TextureManager.
 */
export class PreloaderScene extends Phaser.Scene {
    constructor() {
        super(SceneKeys.Preloader);
    }

    /**
     * Loads all shared game assets.
     */
    preload(): void {
        this.load.image(Assets.CHARACTER, AssetPaths.CHARACTER);
        this.load.image(Assets.PLATFORM, AssetPaths.PLATFORM);
        this.load.image(Assets.LOGO, AssetPaths.LOGO);
        this.load.image(Assets.STAFF, AssetPaths.STAFF);
        this.load.image(Assets.SIGN, AssetPaths.SIGN);
        this.load.image(Assets.CLOUD, AssetPaths.CLOUD);
        this.load.image(Assets.CUBE, AssetPaths.CUBE);
        this.load.image(Assets.BOX, AssetPaths.BOX);
        this.load.image(Assets.HOUSE_SCENE, AssetPaths.HOUSE_SCENE);
        this.load.image(Assets.HOUSE, AssetPaths.HOUSE);
        this.load.image(Assets.DOOR, AssetPaths.DOOR);
    }

    /**
     * Hands over to the menu once everything is loaded.
     */
    create(): void {
        this.scene.start(SceneKeys.Menu);
    }
}
