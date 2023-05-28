import 'phaser'
import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'

const DEFAULT_WIDTH = 750
const DEFAULT_HEIGHT = 1200

const config = {
  type: Phaser.WEBGL,
  backgroundColor: 'rgba(255, 255, 255, 0)',
  fps: {
    forceSetTimeout: true,
    target: 15,
    min: 15,
  },
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [PreloadScene, MainScene],
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
