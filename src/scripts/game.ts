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
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [PreloadScene, MainScene],
}

const game = new Phaser.Game(config);

window.addEventListener('load', () => {
  fetch("http://localhost:3600/worlds/V5FF30oqj").then((response) => response.json()).then((world) => {
    console.log(world);
    game.registry.merge({
      world
    });
  });
})

export default config;

