import 'phaser'
import PreloadScene from './scenes/preloadScene'
import MainScene from './scenes/mainScene'

const DEFAULT_WIDTH = 750
const DEFAULT_HEIGHT = 1320

const config = {
  type: Phaser.WEBGL,
  backgroundColor: '#1F5E6D',
  fps: {
    forceSetTimeout: true,
    target: 15,
    min: 15,
  },
  scale: {
    parent: 'game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [PreloadScene, MainScene],
}

const game = new Phaser.Game(config);

export default game;
