import 'phaser'
// import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'

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
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [PreloadScene],
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
  game.registry.merge({
    fire: "emblem"
  });
})
