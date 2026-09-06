import './style.css';

import Phaser from 'phaser';
import { MainScene } from './core/scenes/MainScene';
import { MenuScene } from './core/scenes/MenuScene';
import { HouseScene } from './core/scenes/HouseScene';
import { GRAVITY } from './core/config/GameConfig';


/**
 * Main bootstrap file for the game configuration.
 * Entry point loaded by index.html.
 */
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    transparent: true,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade', // Physics engine: arcade
        arcade: {
            gravity: { x: 0, y: GRAVITY },

            debug: false,
        },
    },
    scene: [MenuScene, MainScene, HouseScene],
};

// Create the game instance
new Phaser.Game(config);
