interface Component {
  type: string;
  [k: string]: any;
}

interface JSONEntity {
  id: string;
  tags: string[];
  components: Component[];
}

function formatName(name: string) {
  return name.replace(/: /, "_").replace(/ /g, "_");
};

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  async preload() {
    let { world } = this.game.registry.list as {
      id: string;
      world: {
        mapId: string,
        heroes: {
          [k: string]: any
        }
      };
    };
    // if (!world) world = DEBUG_ENTITIES;
    this.load.image("map", `/assets/maps/${world.mapId}.webp`);
    this.load.atlas("skills", "/assets/sheets/skills.webp", "/assets/sheets/skills.json");
    this.load.atlas("weapons", "/assets/sheets/weapons.webp", "/assets/sheets/weapons.json");
    this.load.atlas("interactions", "/assets/sheets/interactions.webp", "/assets/sheets/interactions.json");
    this.load.atlas("skills-ui", "/assets/sheets/skills-ui.webp", "/assets/sheets/skills-ui.json");
    this.load.atlas("statuses", "/assets/statuses/statuses.webp", "/assets/statuses/statuses.json");
    this.load.atlas("path", "/assets/ss.png", "/assets/ss.json");
    // this.load.image("elbow", "/assets/paths/path-up-left.png");
    this.load.atlas("top-banner", "/assets/top-banner.webp", "/assets/top-banner.json");
    this.load.audioSprite("sfx", "/assets/audio/sfx.json", "/assets/audio/sfx.ogg");
    this.load.audioSprite("battle-sfx", "/assets/audio/battle-sfx.json", "/assets/audio/battle-sfx.ogg");
    this.load.audio("confirm", "/assets/audio/confirm.mp3");
    this.load.image("effective-against-enemy", "/assets/effective-against-enemy.png");
    this.load.image("enemy-effective", "/assets/enemy-effective.png");
    this.load.image("ui-button", "/assets/ui-button.png");
    this.load.image("ui-button-pressed", "/assets/ui-button-pressed.png");
    this.load.image("effect-shine", "/assets/effect.png");
    this.load.audio("bgm", "/assets/audio/bgm/leif's army in search of victory.ogg");

    for (let heroId in world.heroes) {
      const heroData = world.heroes[heroId];
      const heroName = heroData.Name[0].value as string;
      const formatted = formatName(heroName);
      this.load.atlas(heroName, `/assets/battle/${formatted}.webp`, `/assets/battle/${formatted}.json`);
      this.load.audioSprite(`${heroName} quotes`, `/assets/audio/quotes/${formatted}.json`, `/assets/audio/quotes/${formatted}.m4a`);
    }
  }

  create() {
    this.scene.start('MainScene');

    /**
     * This is how you would dynamically import the mainScene class (with code splitting),
     * add the mainScene to the Scene Manager
     * and start the scene.
     * The name of the chunk would be 'mainScene.chunk.js
     * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
     */
    // let someCondition = true
    // if (someCondition)
    //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
    //     this.scene.add('MainScene', mainScene.default, true)
    //   })
    // else console.log('The mainScene class will not even be loaded by the browser')
  }
}
