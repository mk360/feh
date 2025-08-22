import PreloadScene from './scenes/preloadScene'
import MainScene from './scenes/mainScene';
import Phaser from "phaser";

const DEFAULT_WIDTH = 540
const DEFAULT_HEIGHT = 1136;

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

const gameId = new URLSearchParams(location.search).get("id");

fetch(`${import.meta.env.VITE_API_URL}/worlds/${gameId}`, {
  headers: {
    authorization: localStorage.getItem("pid")
  }
}).then((response) => {
  if (response.ok) {
    return response.json()
  } else if (response.status === 404) {
    location.href = "/";
    return null
  }
}).then((data) => {
  if (data) {
    const game = new Phaser.Game(config);
    game.registry.set("world", data);
  }
});
