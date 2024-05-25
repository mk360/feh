import 'phaser'
import PreloadScene from './scenes/preloadScene'
import MainScene from './scenes/mainScene';

const DEFAULT_WIDTH = 540
const DEFAULT_HEIGHT = 1040

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  backgroundColor: '#1F5E6D',
  fps: {
    target: 15,
    min: 15,
  },
  scale: {
    parent: 'game',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  input: {
    mouse: {
      preventDefaultWheel: false
    }
  },
  scene: [PreloadScene, MainScene],
}

fetch(`${import.meta.env.VITE_API_URL}/worlds/df`).then((s) => s.json()).then((data) => {
  const game = new Phaser.Game(config);
  game.registry.set("world", data);
});

// export default game;
