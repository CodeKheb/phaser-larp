import './style.css'

import Phaser from "phaser";
import { MainScene } from "./core/scenes/MainScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  transparent: true,
  scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x:0, y: 500},
      debug: false,
    },
  },
  scene: [
      MainScene
  ]
};

new Phaser.Game(config);
