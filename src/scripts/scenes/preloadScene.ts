export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

   preload() {
    this.load.image("map", "assets/maps/map.webp");
    this.load.image("movement-allowed", "assets/movement-allowed.png");
    this.load.atlas("weapons", "assets/sheets/weapons.webp", "assets/sheets/weapons.json");
    this.load.atlas("skills", "assets/sheets/skills.webp", "assets/sheets/skills.json");
    this.load.atlas("interactions", "assets/sheets/interactions.webp", "assets/sheets/interactions.json");
    this.load.audio("hit", "assets/audio/hit.mp3");
    this.load.audio("ko", "assets/audio/ko.mp3");
    this.load.atlas("skills-ui", "assets/sheets/skills-ui.webp", "assets/sheets/skills-ui.json");
    this.load.image("background", "assets/unit-bg-test.png");
    this.load.audioSprite("sfx", "assets/audio/sfx.json", "assets/audio/sfx.ogg");
    this.load.audio("confirm", "assets/audio/confirm.mp3");
    this.load.audio("effect-trigger", "assets/audio/effect-trigger.mp3");
    this.load.image("nameplate", "assets/nameplate.png");
    this.load.image("end-arrow", "assets/end-arrow-fixed.png");
    this.load.image("path-down-right", "assets/path-up-left.png");
    this.load.image("path-right-down", "assets/path-down-left.png");
    this.load.image("path-down-left", "assets/path-up-right.png");
    this.load.image("path-left-down", "assets/path-down-right.png");
    this.load.image("path-up-right", "assets/path-down-right.png");
    this.load.image("path-right-up", "assets/path-up-right.png");
    this.load.image("path-up-left", "assets/path-down-left.png");
    this.load.image("path-left-up", "assets/path-up-left.png");
    this.load.image("buff", "assets/buff-arrow.png");
    this.load.image("ui-button", "assets/ui-button.png");
    this.load.image("ui-button-pressed", "assets/ui-button-pressed.png");
    this.load.image("debuff", "assets/debuff-arrow.png");
    this.load.image("path-left", "assets/horizontal.png");
    this.load.image("path-right", "assets/horizontal.png");
    this.load.image("path-up", "assets/vertical-fixed.png");
    this.load.image("path-down", "assets/vertical-fixed.png");
    this.load.image("unit-bg", "assets/unitbg.png");
    this.load.image("rosary", "assets/rosary-current.png");
    this.load.image("rosary-arrow", "assets/rosary-arrow.png");
    this.load.image("weapon-icon", "assets/weapon_icon.png");
    this.load.image("unit-banner-bg", "assets/unit-banner-bg.png");
    this.load.image("forecast-bg", "assets/forecast-bg.png");
    this.load.image("effect-shine", "assets/effect.png");
    this.load.audio("bgm", "assets/audio/bgm/leif's army in search of victory.ogg");
    for (let hero of ["Corrin", "Hector", "Ike", "Lucina", "Lyn", "Robin", "Ryoma", "Ephraim"]) {
      this.load.atlas(hero, `assets/battle/${hero}.webp`, `assets/battle/${hero}.json`);
      this.load.audioSprite(`${hero} quotes`, `assets/audio/quotes/${hero}.json`, `assets/audio/quotes/${hero}.m4a`);
    }
    this.load.image("hp plate", "assets/hp plate.png");
    this.load.image("stat-line", "assets/stat-glowing-line.png");

    for (let slot of ["A", "B", "C", "S"]) {
      this.load.image(slot, `assets/${slot}.png`);
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
