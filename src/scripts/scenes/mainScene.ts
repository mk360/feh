import { GameObjects, Structs, Tweens } from 'phaser';
import Hero from '../objects/hero';
import UnitInfosBanner from '../objects/unit-infos-banner';
import { renderText } from '../utils/text-renderer';
import CombatForecast from '../objects/combat-forecast';
import Coords from '../../interfaces/coords';
import battle from '../battle';
import HeroData from "feh-battles/dec/hero";
import InteractionIndicator from '../objects/interaction-indicator';
import Team from '../../types/team';
import stringifyTile from '../utils/stringify-tile';

const squareSize = 125;
const squaresOffset = 63;
const fixedY = 120;

function gridToPixels(x: number, y: number) {
  return {
    x: x * squareSize - squaresOffset,
    y: y * squareSize + fixedY,
  }
}

function pixelsToGrid(x: number, y: number) {
  return {
    x: Math.round((squaresOffset + x) / squareSize),
    y: Math.round((y - fixedY) / squareSize)
  };
}

const dblClickMargin = 300;

export default class MainScene extends Phaser.Scene {
  unitInfosBanner: UnitInfosBanner;
  walkCoords: string[] = [];
  attackCoords: string[] = [];
  heroes: Hero[] = [];
  highlightedHero: Hero;
  team1: Hero[] = [];
  team2: Hero[] = [];
  heroesWhoMoved: Hero[] = [];
  turn: Team = "team1";
  rng = new Phaser.Math.RandomDataGenerator();
  heroBackground: Phaser.GameObjects.Rectangle;
  movementAllowedImages: Phaser.GameObjects.Group;
  movementAllowedTween: Phaser.Tweens.Tween;
  movementUI: Phaser.GameObjects.Group;
  combatForecast: CombatForecast;
  interactionIndicator: InteractionIndicator;
  interactionIndicatorTween: Tweens.Tween;
  fpsText: GameObjects.Text;
  rosary: GameObjects.Image;
  endArrow: GameObjects.Image;
  tileHighlight: GameObjects.Image;
  updateDelta = 0;

  constructor() {
    super({ key: 'MainScene' });
  }

  fillTiles(tiles: string[], fillColor: number, alpha = 1) {
    for (let tileName of tiles) {
      const tile = this.getTile(tileName);
      tile.setFillStyle(fillColor, alpha);
    }
  }

  clearTiles(tiles: string[]) {
    for (let tileName of tiles) {
      this.getTile(tileName).setFillStyle(0x0).off("pointerdown").on("pointerdown", () => {
        this.clearTiles([...this.walkCoords, ...this.attackCoords]);
        this.walkCoords = [];
        this.attackCoords = [];
        this.highlightIdleHeroes();
      });
    }
  }

  endAction(hero: Hero) {
    hero.off("drag");
    hero.off("dragover");
    hero.off("dragenter");
    hero.off("dragleave");
    hero.off("dragend");
    hero.off("pointerdown");
    this.input.setDraggable(hero, false);
    hero.disableInteractive();
    hero.image.setTint(0x777777);
    this.heroesWhoMoved.push(hero);
    this.children.remove(this.children.getByName("movement-" + hero.getInternalHero().name));
    this.highlightedHero = null;
  }

  highlightIdleHeroes() {
    this.movementAllowedImages.setVisible(true);
    this.movementAllowedTween.resume();
    this.movementUI.clear(true);
  }

  killHero(hero: Hero) {
    this[hero.team] = this[hero.team].filter(({ name }) => name !== hero.name);
    this.heroes = this.heroes.filter(({ name }) => name !== hero.name);
    this.children.remove(hero);
    battle.killHero(hero.getInternalHero(), hero.team);
    hero.destroy();
    hero = null;
  }

  createTiles() {
    for (let y = 1; y < 9; y++) {
      for (let x = 1; x < 7; x++) {
        const { x: screenX, y: screenY } = gridToPixels(x, y);
        const name = x + "-" + y;
        const tile = this.add.rectangle(screenX, screenY, squareSize, squareSize, 0x0).setAlpha(0.2).setName(name).setInteractive(undefined, undefined, true);
        tile.on("pointerdown", () => {
          if (!this.walkCoords.includes(name) && this.unitInfosBanner.visible) {
            this.clearTiles([...this.walkCoords, ...this.attackCoords]);
            this.sound.playAudioSprite("sfx", "cancel");
            this.unitInfosBanner.setVisible(false);
          }
        })
        // uncomment if you need to check tile coordinates
        this.add.text(tile.getCenter().x, tile.getCenter().y, name, {
          fontSize: "18px"
        });
        
      }
    }
  }

  setTurn(turn: Team) {
    this.movementAllowedImages.clear();
    const otherTeam = turn === "team1" ? "team2" : "team1";
    this.turn = turn;
    this.heroesWhoMoved = [];
    battle.resetEffects(turn);
    const effects = battle.getTurnStartEffects(turn);
    for (let hero of this[turn]) {
      hero.statuses = [];
      hero.setInteractive();
      const { x, y } = pixelsToGrid(hero.x, hero.y);
      let currentCoords: Coords = { x, y };
      this.input.setDraggable(hero, true);
      const img = new Phaser.GameObjects.Image(this, hero.x, hero.y, "movement-allowed").setName(`movement-${hero.getInternalHero().name}`).setDepth(0);
      this.add.existing(img);
      const matchingTile = this.getTile(currentCoords.x + "-" + currentCoords.y);    
      img.setDisplaySize(matchingTile.width, matchingTile.height);
      this.movementAllowedImages.add(img);

      let previousSoundFile = "";
      let clickTimestamp = 0;
      
      hero.off("pointerdown");
      hero.on("drag", (_, dragX: number, dragY: number) => {
        hero.x = dragX;
        hero.y = dragY;
      });
      const s = hero.getInternalHero();
      hero.on("dragenter", (_, target: GameObjects.Rectangle) => {
        if (this.walkCoords.includes(target.name)) {
          const movementImage = this.children.getByName(`movement-${s.name}`) as GameObjects.Image;
          movementImage.x = target.x;
          movementImage.y = target.y;
          movementImage.setVisible(true);
          const path = battle.crossTile(s, target.name, this.walkCoords);
          this.renderPath(path);
          this.sound.playAudioSprite("sfx", "hover");
          
        }
      });

      hero.on("dragend", () => {
        const { x, y } = hero.getInternalHero().coordinates;
        const { x: x1, y: y1 } = gridToPixels(x, y);
        this.rosary.setVisible(false);
        this.tweens.add({
          targets: hero,
          x: x1,
          y: y1,
          duration: 100
        });
        const tile = this.getTile(x + "-" + y);
        const movementImage = this.children.getByName(`movement-${s.name}`) as GameObjects.Image;
        movementImage.x = tile.x;
        movementImage.y = tile.y;
      });
      
      hero.on("dragleave", (_, target: GameObjects.Rectangle) => {
        battle.leaveTile(target.name);
      });

      hero.on("pointerdown", ({ event: { timeStamp } }) => {
        battle.resetPathfinder();
        this.clearTiles([...this.walkCoords, ...this.attackCoords]);
        if (timeStamp - clickTimestamp <= dblClickMargin) {
          this.sound.play("confirm");
          this.endAction(hero);
          return;
        }
        const internalHero = hero.getInternalHero();
        clickTimestamp = timeStamp;
        this.movementAllowedImages.setVisible(false);
        const img = this.children.getByName(`movement-${internalHero.name}`) as GameObjects.Image;
        img.setVisible(true);
        this.movementAllowedTween.pause();
        this.sound.playAudioSprite("sfx", "tap");
        const n = this.rng.integerInRange(1, 3);
        if (previousSoundFile) this.sound.stopByKey(previousSoundFile);
        const soundFile = internalHero.name + " quotes";
        this.sound.playAudioSprite(internalHero.name + " quotes", n.toString(), { volume: 0.2 });
        previousSoundFile = soundFile;
        this.unitInfosBanner.setHero(hero).setVisible(true);
        this.displayRanges(hero.getInternalHero());
      });
    }

    this.movementAllowedTween = this.tweens.add({
      targets: this.movementAllowedImages.getChildren(),
      loop: -1,
      yoyo: true,
      duration: 900,
      alpha: 0
    });

    for (let hero of this[otherTeam]) {
      hero.off("dragover");
      hero.off("dragend");
      this.children.remove(this.children.getByName("movement-" + hero.getInternalHero().name));
      hero.image.clearTint();
      this.input.setDraggable(hero, false);
      hero.setInteractive();
      hero.off("dragstart");
      hero.off("pointerdown").on("pointerdown", () => {
        this.displayRanges(hero.getInternalHero());
        this.sound.playAudioSprite("sfx", "tap");
        this.highlightedHero = hero;
        this.unitInfosBanner.setVisible(true).setHero(hero);
      });
    }

    for (let effect of effects) {
      const target = this.children.getByName(effect.targetHeroId) as Hero;
      if (target && effect.appliedEffect.stats) {
        target.getInternalHero().setMapBoosts(effect.appliedEffect.stats);
        target.statuses.push("buff");
      }
    }
  }

  renderPath(path: { start: string, end: string, tilesInBetween: string[] }) {
    this.movementUI.setVisible(false);
    const { start, end, tilesInBetween } = path;
    const startTile = this.getTile(start);
    const endTile = this.getTile(end);
    const { x: startX, y: startY } = startTile.getCenter();
    this.rosary.x = startX;
    this.rosary.y = startY;
    this.rosary.setVisible(true);
    console.log({ start, end });
    this.endArrow.x = endTile.x;
    this.endArrow.y = endTile.y;
    this.endArrow.setVisible(end !== start);
  }

  // todo: simplify signature
  addHero(heroData: HeroData, team: Team) {
    const { x, y } = gridToPixels(heroData.coordinates.x, heroData.coordinates.y);
    const heroObject = new Hero(this, x, y, heroData, team).setInteractive();
    this.add.existing(heroObject);
    this.heroes.push(heroObject);
    this[team].push(heroObject);
    heroObject.setDepth(1);
    return heroObject;
  }

  moveHero(hero: Hero, destination: Coords) {
    battle.moveHero(hero.getInternalHero(), destination);
    const { x, y } = gridToPixels(destination.x, destination.y);
    hero.x = x;
    hero.y = y;
  }

  startBackgroundMusic(volume: number) {
    const bgm = this.sound.add("bgm");
    bgm.addMarker({
      name: "loop",
      start: 4.25
    });
    bgm.play({ volume });
    bgm.on("complete", () => {
      bgm.play("loop", { volume });
    });
  };

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
    this.load.image("nameplate", "assets/nameplate.png");
    this.load.image("end-arrow", "assets/end-arrow-fixed.png");
    this.load.image("path-down-right", "assets/path-down-left.png");
    this.load.image("path-down-left", "assets/path-down-right.png");
    this.load.image("path-up-right", "assets/path-up-right.png");
    this.load.image("path-up-left", "assets/path-up-left.png");
    this.load.image("buff", "assets/buff-arrow.png");
    this.load.image("debuff", "assets/debuff-arrow.png");
    this.load.image("horizontal", "assets/horizontal.png");
    this.load.image("vertical", "assets/vertical-fixed.png");
    this.load.image("unit-bg", "assets/unitbg.png");
    this.load.image("rosary", "assets/rosary-current.png");
    this.load.image("rosary-arrow", "assets/rosary-arrow.png");
    this.load.image("weapon-icon", "assets/weapon_icon.png");
    this.load.image("unit-banner-bg", "assets/unit-banner-bg.png");
    this.load.image("forecast-bg", "assets/forecast-bg.png");
    // todo: compress into audio sprite
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
    this.movementAllowedImages = this.add.group();
    this.movementUI = this.add.group();
    this.add.rectangle(0, 180, 750, 1000, 0xFFFFFF).setOrigin(0);
    const banner = this.add.image(-90, 0, "background").setOrigin(0).setTint(0x0F343D);
    this.startBackgroundMusic(0.13);
    banner.setDisplaySize(banner.displayWidth, 180);
    this.combatForecast = this.add.existing(new CombatForecast(this).setVisible(false));
    this.add.image(0, 180, "map").setDisplaySize(750, 1000).setOrigin(0, 0).setDepth(0);
    this.createTiles();
    
    for (let heroId in battle.team1) {
      const hero = battle.team1[heroId];
      this.addHero(hero, "team1");
    }

    for (let heroId in battle.team2) {
      const hero = battle.team2[heroId];
      this.addHero(hero, "team2");
    }

    this.setTurn("team1");
    this.interactionIndicator = this.add.existing(new InteractionIndicator(this, 0, 0).setVisible(false).setDepth(5));
    this.unitInfosBanner = this.add.existing(new UnitInfosBanner(this).setVisible(false)).setDepth(1);
    this.fpsText = renderText(this, 500, 120, "", { fontSize: "25px" });
    this.rosary = this.add.image(0, 0, "rosary").setVisible(false);
    this.endArrow = this.add.image(0, 0, "end-arrow").setVisible(false);
    // this.tileHighlight = this.add.image(0, 0, "").setVisible(false);
}

  displayRanges(hero: HeroData) {
    this.clearTiles(this.walkCoords.concat(this.attackCoords));
    const walkTiles = battle.getMovementTiles(hero);
    const weaponTiles = battle.getAttackTiles(hero, walkTiles);
    const stringWalkTiles = walkTiles.map(stringifyTile);
    this.walkCoords = stringWalkTiles;
    this.attackCoords = weaponTiles;
    this.fillTiles(stringWalkTiles, 0x0000FF);
    this.fillTiles(weaponTiles, 0xFF0000);
    return {
      walkTiles: walkTiles.map(({ x, y }) => x + "-" + y),
      weaponTiles,
    };
  }

  getTile(name: string) {
    return this.children.getByName(name) as Phaser.GameObjects.Rectangle;
  }

  update(_, delta: number) {
    this.updateDelta += delta;
    if (this.updateDelta >= 16.67 * 60) {
      this.updateDelta = 0;
      for (let hero of this.heroes) {
        hero.toggleStatuses();
      }
    }
    for (let hero of this.heroes) {
      hero.update();
    }

    if (this.heroesWhoMoved.length === this[this.turn].length) {
      const otherTeam = this.turn === "team1" ? "team2": "team1";
      this.setTurn(otherTeam);
    }
  }
}

function getDiff<T>(map1: Map<string, T>, map2: Map<string, T>) {
  const diff = new Map<string, T>();

  for (let [entry, val] of map1.entries()) {
    if (!map2.has(entry)) {
      diff.set(entry, val);
    }
  }

  for (let [entry, val] of map2.entries()) {
    if (!map1.has(entry)) {
      diff.set(entry, val);
    }
  }

  return diff;
}

function getTilesDirection(tile1: Coords, tile2: Coords) {
  const directions = {
    y: "",
    x: "",
  };

  if (tile1.y !== tile2.y) {
    directions.y = tile1.y < tile2.y ? "down" : "up";
  }

  if (tile1.x !== tile2.x) {
    directions.x  = tile1.x < tile2.x ? "right" : "left";
  }

  return directions;
};
