import './style.css';

import Phaser from 'phaser';
import { MainScene } from './core/scenes/MainScene';
import { MenuScene } from './core/scenes/MenuScene';
import { HouseScene } from './core/scenes/HouseScene';

/**
 * Main bootstrap file for the game configuration.
 * entrypoint loaded by index.html
 */
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO, // Renderer type: auto-detect WebGL or Canvas
    parent: 'game-container', // Container ID
    transparent: true, // Transparent background
    scale: {
        mode: Phaser.Scale.RESIZE, // Scale mode: resize the game to fit the browser window
        autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game horizontally and vertically
    },
    physics: {
        default: 'arcade', // Physics engine: arcade
        arcade: {
            gravity: { x: 0, y: 1800 },
            debug: false,
        },
    },
    scene: [
        // List of registered scenes:
        MenuScene,
        MainScene,
        HouseScene,
    ],
};

// Create the game instance
new Phaser.Game(config);
