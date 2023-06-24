import { GameObjects, Time, Tweens } from 'phaser';
import Hero from '../objects/hero';
import UnitInfosBanner from '../objects/unit-infos-banner';
import { renderDamageText, renderText } from '../utils/text-renderer';
import CombatForecast from '../objects/combat-forecast';
import Coords from '../../interfaces/coords';
import battle from '../classes/battle';
import HeroData from "feh-battles/dec/hero";
import InteractionIndicator from '../objects/interaction-indicator';
import Team from '../../types/team';
import stringifyTile from '../utils/stringify-tile';
import toCoords from '../utils/to-coords';
import UIAction from '../../interfaces/ui-action';
import { CombatOutcome } from 'feh-battles/dec/combat';
import Button from '../objects/button';

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

function createHeroQuoter(scene: MainScene) {
  let previousQuote = "";

  return (hero: Hero) => {
    const internalHero = hero.getInternalHero();
    const n = scene.rng.integerInRange(1, 3);
    if (previousQuote) scene.sound.stopByKey(previousQuote);
    const soundFile = internalHero.name + " quotes";
    scene.sound.playAudioSprite(internalHero.name + " quotes", n.toString(), { volume: 0.2 });
    previousQuote = soundFile;
  };
}

const dblClickMargin = 300;

function createDoubleTapHandler() {
  let previousTimeStamp = 0;
  return (timeStamp: number) => {
    const isDoubleTap = timeStamp - previousTimeStamp <= dblClickMargin;
    previousTimeStamp = timeStamp;
    return isDoubleTap;
  };
}


export default class MainScene extends Phaser.Scene {
  unitInfosBanner: UnitInfosBanner;
  walkTiles: string[] = [];
  enemyRangeCoords: string[] = [];
  attackTiles: string[] = [];
  heroes: Hero[] = [];
  team1: Hero[] = [];
  team2: Hero[] = [];
  heroesWhoMoved: Hero[] = [];
  turn: Team = "team1";
  rng = new Phaser.Math.RandomDataGenerator();
  heroBackground: Phaser.GameObjects.Rectangle;
  movementArrows: GameObjects.Group;
  movementAllowedImages: Phaser.GameObjects.Group;
  movementAllowedTween: Phaser.Tweens.Tween;
  combatForecast: CombatForecast;
  interactionIndicator: InteractionIndicator;
  interactionIndicatorTween: Tweens.Tween;
  fpsText: GameObjects.Text;
  actionsTray: GameObjects.Group;
  rosary: GameObjects.Image;
  endArrow: GameObjects.Image;
  tileHighlight: GameObjects.Image;
  updateDelta = 0;
  timeline: Time.Timeline;

  constructor() {
    super({ key: 'MainScene' });
    this.walkTiles = [];
    this.attackTiles = [];
  }

  fillTiles(tiles: string[], fillColor: number, alpha = 1) {
    for (let tileName of tiles) {
      const tile = this.getTile(tileName);
      tile.setFillStyle(fillColor, alpha);
    }
  }

  activateHero(hero: Hero) {
    hero.on("drag", (_, dragX: number, dragY: number) => {
        hero.x = dragX;
        hero.y = dragY;
      });
      hero.on("dragenter", (_, target: GameObjects.Rectangle | Hero) => {
        this.combatForecast.disable();
        if (target instanceof GameObjects.Rectangle && this.walkTiles.includes(target.name)) {
          const movementImage = this.children.getByName(`movement-${hero.name}`) as GameObjects.Image;
          movementImage.x = target.x;
          movementImage.y = target.y;
          movementImage.setVisible(true);
          const path = battle.crossTile(hero.getInternalHero(), target.name, this.walkTiles);
          this.renderPath(path);
          this.sound.playAudioSprite("sfx", "hover");
        }

        const actions = battle.decideDragAction(target.name, hero.getInternalHero(), this.walkTiles, this.attackTiles);
        if (actions) {
          for (let action of actions) {
            this.processAction(action, hero);
          }
        }
      });

      hero.on("dragend", () => {
        const targetTile = pixelsToGrid(hero.x, hero.y);
        const actions = battle.decideDragDropAction(targetTile.x + "-" + targetTile.y, hero.getInternalHero(), this.walkTiles, this.attackTiles);
        for (let action of actions) {
          this.processAction(action, hero);
        }
        this.rosary.setVisible(false);
        
      });
      
      hero.on("dragleave", (_, target: GameObjects.Rectangle) => {
        if (this.walkTiles.includes(target.name)) {
          battle.leaveTile(target.name);
        }
      });

      hero.on("pointerdown", ({ event: { timeStamp } }) => {
        battle.resetPathfinder();
        this.clearTiles(this.walkTiles.concat(this.attackTiles));

        if (this.handleDoubleTap(timeStamp)) {
          this.sound.play("confirm");
          this.endAction(hero);
          return;
        }
        this.movementAllowedImages.setVisible(false);
        const img = this.children.getByName(`movement-${hero.name}`) as GameObjects.Image;
        img.setVisible(true).setAlpha(1);
        this.movementAllowedTween.pause();
        this.playHeroQuote(hero);
        this.displayHeroInformations(hero)();
      });
  }

  processAction(action: UIAction, hero: Hero) {
    if (action.type === "cancel") {
      const { args } = action;
      this.endArrow.setVisible(false);
      this.movementArrows.clear(true, true);
      const pxCoords = gridToPixels(args.x, args.y);
      this.tweens.add({
        targets: hero,
        x: pxCoords.x,
        y: pxCoords.y,
        duration: 100
      });
      (this.children.getByName(`movement-${hero.name}`) as GameObjects.Image).x = pxCoords.x;
      (this.children.getByName(`movement-${hero.name}`) as GameObjects.Image).y = pxCoords.y;
      battle.resetPathfinder();
    }

    if (action.type === "move") {
      const { args } = action;
      this.endArrow.setVisible(false);
      this.movementArrows.clear(true, true);
      const pxCoords = gridToPixels(args.x, args.y);
      hero.x = pxCoords.x;
      hero.y = pxCoords.y;
      battle.moveHero(hero.getInternalHero(), args);
    }

    if (action.type === "disable") {
      const hero = this.children.getByName(action.args.id) as Hero;
      this.endAction(hero);
    }

    if (action.type === "attack") {
      this.runCombat(action.args.outcome);
    }

    if (action.type === "preview") {
      const { args } = action;
      this.unitInfosBanner.setVisible(false);
      this.interactionIndicatorTween?.destroy();
      const defenderCoordinates = this.getHeroCoordinates(this.children.getByName(args.defender.id) as Hero);
      this.interactionIndicator.x = defenderCoordinates.x;
      this.interactionIndicator.y = defenderCoordinates.y - 80;
      this.interactionIndicatorTween = this.tweens.add({
        targets: [this.interactionIndicator],
        y: defenderCoordinates.y - 70,
        duration: 400,
        loop: -1,
        yoyo: true,
      }) as Tweens.Tween;
      this.interactionIndicatorTween.play();
      this.interactionIndicator.setVisible(true);
      this.combatForecast.setVisible(true).setForecastData({
        attacker: {
          hero: args.attacker,
          ...args.outcome.attacker
        },
        defender: {
          hero: args.defender,
          ...args.outcome.defender
        }
      });
    }
  }

  getHeroCoordinates(hero: Hero) {
    const coordinatesVector = new Phaser.Math.Vector2(hero.x, hero.y);
    coordinatesVector.add(hero.image.getCenter());

    return coordinatesVector;
  }

  createDamageText(turn: CombatOutcome["turns"][number]) {
    const isAdvantage = turn.effective || turn.advantage === "advantage";
    const isDisadvantage = turn.advantage === "disadvantage" && !turn.effective;
    const damageFontSize = isDisadvantage ? 20 : isAdvantage ? 30 : 26;
    const defenderObject = this.children.getByName(turn.defender.id) as Hero;
    const coordinatesVector = this.getHeroCoordinates(defenderObject);
    const damageText = renderDamageText({
      scene: this,
      x: coordinatesVector.x,
      y: coordinatesVector.y,
      content: turn.damage,
      style: {
        fontSize: damageFontSize,
      }
    }).setDepth(4);

    return damageText;
  }

  runCombat(outcome: CombatOutcome) {
    const timeline = this.add.timeline([]);
    for (let i = 0; i < outcome.turns.length; i++) {
      const turn = outcome.turns[i];
      const damageText = this.createDamageText(turn).setVisible(false).setOrigin(0);
      this.add.existing(damageText);
      const attackerObject = this.children.getByName(turn.attacker.id) as Hero;
      const defenderObject = this.children.getByName(turn.defender.id) as Hero;
      const attackerCoordinates = this.getHeroCoordinates(attackerObject);
      const defenderCoordinates = this.getHeroCoordinates(defenderObject);
      const damageTween = this.tweens.create({
        targets: [damageText],
        y: "-=20",
        duration: 150,
        yoyo: true,
        onStart: () => {
          damageText.setVisible(true);
        },
        onComplete: () => {
          this.children.remove(damageText);
          damageText.destroy(true);
        }
      }) as Tweens.Tween;
      timeline.add([{
        at: i * 800 + 400,
        tween: {
          targets: attackerObject,
          x: `-=${(attackerCoordinates.x - defenderCoordinates.x) / 2}`,
          y: `-=${(attackerCoordinates.y - defenderCoordinates.y) / 2}`,
          yoyo: true,
          duration: 150,
          onYoyo: () => {
            this.sound.play("hit");
            defenderObject.updateHP(turn.remainingHP);
            const combatAttacker = this.children.getByName(outcome.attacker.id) as Hero;
            const combatDefender = this.children.getByName(outcome.defender.id) as Hero;
            const attackerRatio = combatAttacker.getInternalHero().stats.hp / combatAttacker.getInternalHero().maxHP;
            const defenderHPRatio = combatDefender.getInternalHero().stats.hp / combatDefender.getInternalHero().maxHP;
            this.combatForecast.updatePortraits(attackerRatio, defenderHPRatio);
          }
        }
      }]);
      timeline.add([{
        at: i * 800 + 475,
        tween: damageTween
      }, {
        at: i * 800 + 475,
        tween: defenderObject.createFlashTween()
      }]);
    }

    const deadUnit = [outcome.attacker, outcome.defender].find((hero) => hero.remainingHP === 0);
    if (deadUnit) {
      const deadUnitObject = this.children.getByName(deadUnit.id) as Hero;
      const koTween = this.createKOTween(deadUnitObject);
      timeline.add([{tween: koTween, at: 800 * outcome.turns.length + 500 }])
    }

    if (outcome.attacker.remainingHP) {
      timeline.add([{
        at: 800 * outcome.turns.length + 900,
        tween: {
          targets: [],
          onComplete: () => {
            const attackerObject = this.children.getByName(outcome.attacker.id) as Hero;
            this.endAction(attackerObject);
          }
        }
      }]);
    }

    timeline.add([{
      at: 800 * outcome.turns.length + 600,
      tween: {
        targets: [],
        onComplete: () => {
          this.game.input.enabled = true;
        }
      }
    }]);

    this.game.input.enabled = false;
    timeline.play();
  };

  resetView() {
    this.clearTiles(this.walkTiles.concat(this.attackTiles));
    this.walkTiles = [];
    this.attackTiles = [];
    this.highlightIdleHeroes();
    this.unitInfosBanner.setVisible(false);
  }

  clearTiles(tiles: string[]) {
    for (let tileName of tiles) {
      this.getTile(tileName).setFillStyle(0x0).off("pointerdown").on("pointerdown", this.resetView);
    }
  }

  displayHeroInformations(hero: Hero) {
    return () => {
      this.displayRanges(hero.getInternalHero());
      this.sound.playAudioSprite("sfx", "tap");
      this.unitInfosBanner.setVisible(true).setHero(hero);
    }
  }

  endAction(hero: Hero) {
    hero.off("drag");
    hero.off("dragover");
    hero.off("dragenter");
    hero.off("dragleave");
    hero.off("dragend");
    hero.off("pointerdown").on("pointerdown", this.displayHeroInformations(hero));
    this.input.setDraggable(hero, false);
    battle.resetPathfinder();
    hero.image.setTint(0x777777);
    this.sound.play("confirm");
    this.heroesWhoMoved.push(hero);
    this.children.remove(this.children.getByName("movement-" + hero.name));
    this.endArrow.setVisible(false);
    this.highlightIdleHeroes();
    this.movementArrows.clear(true, true);
    this.clearTiles(this.walkTiles.concat(this.attackTiles));
  }

  highlightIdleHeroes() {
    this.movementAllowedImages.setVisible(true);
    (this.movementAllowedTween.targets as GameObjects.Image[]).forEach((image) => {
      image.setAlpha(1);
    });
    this.movementAllowedTween.resume();
  }

  killHero(hero: Hero) {
    this[hero.team] = this[hero.team].filter(({ name }) => name !== hero.name);
    this.heroes = this.heroes.filter(({ name }) => name !== hero.name);
  }

  createKOTween(hero: Hero) {
    return this.tweens.create({
      targets: hero.image,
      alpha: 0,
      duration: 300,
      onStart: () => {
        this.sound.play("ko");
      },
      onComplete: () => {
        this.children.remove(hero);
        battle.killHero(hero.getInternalHero(), hero.team);
        hero.destroy();
        hero = null;
      }
    }) as Tweens.Tween;
  }

  createTiles() {
    for (let y = 1; y < 9; y++) {
      for (let x = 1; x < 7; x++) {
        const { x: screenX, y: screenY } = gridToPixels(x, y);
        const name = x + "-" + y;
        const tile = this.add.rectangle(screenX, screenY, squareSize, squareSize, 0x0).setAlpha(0.2).setName(name).setInteractive(undefined, undefined, true);
        tile.on("pointerdown", () => {
          if (!this.walkTiles.includes(name) && this.unitInfosBanner.visible) {
            this.sound.playAudioSprite("sfx", "cancel");
            this.resetView();
          }
        });
        // uncomment if you need to check tile coordinates
        // this.add.text(tile.getCenter().x, tile.getCenter().y, name, {
        //   fontSize: "18px"
        // });
      }
    }
  }

  playHeroQuote = createHeroQuoter(this);
  handleDoubleTap = createDoubleTapHandler();

  setTurn(turn: Team) {
    this.movementAllowedImages.clear(true, true);
    const otherTeam = turn === "team1" ? "team2" : "team1";
    this.turn = turn;
    this.heroesWhoMoved = [];
    battle.resetEffects(turn);
    const effects = battle.getTurnStartEffects(turn);
    for (let hero of this[turn]) {
      const { x, y } = pixelsToGrid(hero.x, hero.y);
      let currentCoords: Coords = { x, y };
      this.input.setDraggable(hero, true);
      const img = new Phaser.GameObjects.Image(this, hero.x, hero.y, "movement-allowed").setName(`movement-${hero.name}`).setDepth(0);
      const matchingTile = this.getTile(currentCoords.x + "-" + currentCoords.y);
      img.setDisplaySize(matchingTile.width, matchingTile.height);
      this.movementAllowedImages.add(img, true);
      this.activateHero(hero);
    }
    this.movementAllowedTween?.stop().destroy();
    this.movementAllowedTween = this.tweens.add({
      targets: this.movementAllowedImages.getChildren(),
      loop: -1,
      yoyo: true,
      duration: 900,
      alpha: 0,
    });
    for (let hero of this[otherTeam]) {
      hero.off("dragend");
      const expiredMovementImage = this.children.getByName("movement-" + hero.name);
      this.movementAllowedImages.remove(expiredMovementImage, true, true);
      hero.image.clearTint();
      this.input.setDraggable(hero, false);
      hero.off("dragstart");
      hero.off("dragenter");
      hero.off("pointerdown").on("pointerdown", this.displayHeroInformations(hero));
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
    this.movementArrows.setVisible(true).clear(true, true);
    const { start, end, tilesInBetween } = path;
    const fullPath = [start].concat(tilesInBetween).concat(end);
    const startTile = this.getTile(start);
    const endTile = this.getTile(end);
    const { x: startX, y: startY } = startTile.getCenter();
    this.rosary.x = startX;
    this.rosary.y = startY;
    this.rosary.setVisible(true);
    this.endArrow.x = endTile.x;
    this.endArrow.y = endTile.y;
    this.endArrow.setVisible(end !== start);

    const endArrowDirection = getTilesDirection(toCoords(fullPath[fullPath.length - 2]), toCoords(end));
    const verticalAngle = endArrowDirection === "down" ? 90 : endArrowDirection === "up" ? -90 : null;
    const horizontalAngle = endArrowDirection === "left" ? 180 : endArrowDirection === "right" ? 0 : null;
    const finalAngle = verticalAngle ?? horizontalAngle;
    this.endArrow.setAngle(finalAngle);

    if (start !== end) {
      this.rosary.setTexture("rosary-arrow");
      const rosaryDirection = getTilesDirection(toCoords(start), toCoords(fullPath[1]));
      const verticalAngle = rosaryDirection === "down" ? 0 : rosaryDirection === "up" ? 180 : null;
      const horizontalAngle = rosaryDirection === "left" ? 90 : rosaryDirection === "right" ? -90 : null;
      const finalAngle = verticalAngle ?? horizontalAngle;
      this.rosary.setAngle(finalAngle);
    }

    if (tilesInBetween) {
      for (let i = 0; i < tilesInBetween.length; i++) {
        const tile = tilesInBetween[i];
        const previousTile = i === 0 ? start : tilesInBetween[i - 1];
        const nextTile = i === tilesInBetween.length - 1 ? end : tilesInBetween[i + 1];
        const gameTile = this.getTile(tile);
        const fromPreviousTile = getTilesDirection(toCoords(previousTile), toCoords(tilesInBetween[i]));
        const toNextTile = getTilesDirection(toCoords(tilesInBetween[i]), toCoords(nextTile));
        const tileCenter = gameTile.getCenter();
        if (fromPreviousTile === toNextTile) {
          const straightPath = new GameObjects.Image(this, tileCenter.x, tileCenter.y, `path-${fromPreviousTile}`);
          this.movementArrows.add(straightPath, true);
        } else {
          const elbow = new GameObjects.Image(this, tileCenter.x, tileCenter.y, `path-${fromPreviousTile}-${toNextTile}`);
          this.movementArrows.add(elbow, true);
        }
      }
    }
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
    this.actionsTray = this.add.group();
    this.movementAllowedImages = this.add.group();
    this.movementArrows = this.add.group();
    this.add.rectangle(0, 180, 750, 1000, 0xFFFFFF).setOrigin(0);
    const banner = this.add.image(-90, 0, "background").setOrigin(0).setTint(0x0F343D);
    this.startBackgroundMusic(0.13);
    banner.setDisplaySize(banner.displayWidth, 180);
    this.add.image(0, 180, "map").setDisplaySize(750, 1000).setOrigin(0, 0).setDepth(0);
    this.createTiles();
    const endTurn = new Button(this, 70, 1250, "End Turn");
    const enemyRange = new Button(this, 190, 1250, "Enemy Range");
    this.actionsTray.add(endTurn, true);
    this.actionsTray.add(enemyRange, true);
    endTurn.on("pointerdown", () => {
      this.setTurn(this.turn === "team1" ? "team2" : "team1");
      this.game.input.enabled = false;
      this.game.input.enabled = true;
    });
    let enabled = false;
    enemyRange.on("pointerdown", () => {
      enabled = !enabled;
      const otherTeam = this.turn === "team1" ? "team2" : "team1";
      const enemyRangeTiles = battle.getEnemyRange(otherTeam);
      if (enabled) {
        this.enemyRangeCoords = enemyRangeTiles;
        this.fillTiles(enemyRangeTiles, 0xFF5111, 1);
      } else {
        this.clearTiles(enemyRangeTiles);
      }
    });
    
    for (let heroId in battle.team1) {
      const hero = battle.team1[heroId];
      this.addHero(hero, "team1");
    }
    
    for (let heroId in battle.team2) {
      const hero = battle.team2[heroId];
      this.addHero(hero, "team2");
    }
    
    this.setTurn("team1");
    this.interactionIndicator = this.add.existing(new InteractionIndicator(this, 0, 0).setVisible(false).setDepth(6));
    this.unitInfosBanner = this.add.existing(new UnitInfosBanner(this).setVisible(false)).setDepth(1);
    this.combatForecast = this.add.existing(new CombatForecast(this).setVisible(false)).setDepth(1);
    this.fpsText = renderText(this, 500, 120, "", { fontSize: "25px" });
    this.rosary = this.add.image(0, 0, "rosary").setVisible(false);
    this.endArrow = this.add.image(0, 0, "end-arrow").setVisible(false);
}

  displayRanges(hero: HeroData) {
    this.clearTiles(this.walkTiles.concat(this.attackTiles));
    const walkTiles = battle.getMovementTiles(hero);
    const weaponTiles = battle.getAttackTiles(hero, walkTiles);
    const stringWalkTiles = walkTiles.map(stringifyTile);
    this.walkTiles = stringWalkTiles;
    this.attackTiles = weaponTiles;
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

    if (this.heroesWhoMoved.length === this[this.turn].length) {
      const otherTeam = this.turn === "team1" ? "team2": "team1";
      this.setTurn(otherTeam);
    }
  }
}

function getTilesDirection(tile1: Coords, tile2: Coords) {
  if (tile1.y !== tile2.y) {
    return tile1.y < tile2.y ? "down" : "up";
  }

  if (tile1.x !== tile2.x) {
    return tile1.x < tile2.x ? "right" : "left";
  }
};
