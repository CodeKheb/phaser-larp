import './style.css'

import Phaser from "phaser";
import {GameScene} from "./scenes/main_scene.ts";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,

  scale: {
      mode: Phaser.Scale.FIT,
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
      GameScene
  ]
};

new Phaser.Game(config);
