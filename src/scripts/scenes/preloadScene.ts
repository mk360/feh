export default class PreloadScene extends Phaser.Scene {
  constructor(test: string) {
    super({ key: 'PreloadScene' })
  }

   preload() {
    this.load.image("map", "assets/maps/map.webp");
    this.load.atlas("weapons", "assets/sheets/weapons.webp", "assets/sheets/weapons.json");
    this.load.atlas("skills", "assets/sheets/skills.webp", "assets/sheets/skills.json");
    this.load.atlas("interactions", "assets/sheets/interactions.webp", "assets/sheets/interactions.json");
    this.load.atlas("skills-ui", "assets/sheets/skills-ui.webp", "assets/sheets/skills-ui.json");
    this.load.audioSprite("sfx", "assets/audio/sfx.json", "assets/audio/sfx.ogg");
    this.load.audioSprite("battle-sfx", "assets/audio/battle-sfx.json", "assets/audio/battle-sfx.ogg");
    this.load.audio("confirm", "assets/audio/confirm.mp3");
    this.load.image("effective", "assets/effective-against-enemy.png");
    this.load.image("effective-against", "assets/enemy-effective.png");
    this.load.image("buff", "assets/buff-arrow.png");
    this.load.image("ui-button", "assets/ui-button.png");
    this.load.atlas("paths", "assets/path.png", "assets/path.json");
    this.load.atlas("banner-ui", "assets/top-banner.png", "assets/top-banner.json");
    this.load.image("ui-button-pressed", "assets/ui-button-pressed.png");
    this.load.image("debuff", "assets/debuff-arrow.png");
    this.load.image("effect-shine", "assets/effect.png");
    this.load.audio("bgm", "assets/audio/bgm/leif's army in search of victory.ogg");
    for (let hero of ["Corrin", "Hector", "Ike", "Lucina", "Lyn", "Robin", "Ryoma", "Ephraim"]) {
      this.load.atlas(hero, `assets/battle/${hero}.webp`, `assets/battle/${hero}.json`);
      this.load.audioSprite(`${hero} quotes`, `assets/audio/quotes/${hero}.json`, `assets/audio/quotes/${hero}.m4a`);
    }
  }

  create() {
    this.scene.start('MainScene')

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
