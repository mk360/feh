import { GameObjects, Tweens } from 'phaser';
import Hero from '../objects/hero';
import TileType from '../../types/tiles';
import UnitInfosBanner from '../objects/unit-infos-banner';
import { renderText } from '../utils/text-renderer';
import CombatForecast from '../objects/combat-forecast';
import Coords from '../../interfaces/coords';
import battle from '../classes/battle';
import HeroData from "feh-battles/dec/hero";
import InteractionIndicator from '../objects/interaction-indicator';

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
  map: (Hero | null)[][] = [];
  walkCoords: string[] = [];
  attackCoords: string[] = [];
  displayRange = false;
  heroes: Hero[] = [];
  highlightedHero: Hero;
  team1: Hero[] = [];
  team2: Hero[] = [];
  heroesWhoMoved: Hero[] = [];
  turn: "team1" | "team2" = "team1";
  rng = new Phaser.Math.RandomDataGenerator();
  heroBackground: Phaser.GameObjects.Rectangle;
  movementAllowedImages: Phaser.GameObjects.Group;
  movementAllowedTween: Phaser.Tweens.Tween;
  movementArrows: Phaser.GameObjects.Group;
  combatForecast: CombatForecast;
  interactionIndicator: InteractionIndicator;
  interactionIndicatorTween: Tweens.Tween;
  terrain: TileType[][] = [
    ["wall", "floor", "floor", "floor", "floor", "floor"],
    ["wall", "floor", "floor", "floor", "void", "floor"],
    ["floor", "floor", "floor", "floor", "floor", "floor"],
    ["floor", "floor", "floor", "floor", "floor", "floor"],
    ["floor", "wall", "floor", "tree", "floor", "tree"],
    ["floor", "tree", "floor", "floor", "floor", "wall"],
    ["floor", "floor", "floor", "floor", "floor", "floor"],
    ["tree", "void", "void", "void", "void", "tree"]
  ];
  fpsText: GameObjects.Text;
  updateDelta = 0;

  constructor() {
    super({ key: 'MainScene' });
    // todo: refactor into a number-indexed object, maybe?
    for (let i = 0; i < 9; i++) {
      const newArray = Array.from<Hero | null>({ length: 6 }).fill(null);
      this.map.push(newArray);
    }
  }

  fillTiles(tiles: string[], fillColor: number, alpha = 1) {
    for (let tileName of tiles) {
      const tile = this.getTile(tileName);
      tile.setFillStyle(fillColor, alpha);
    }
  }

  clearTiles(tiles: string[]) {
    for (let tileName of tiles) {
      this.getTile(tileName).setFillStyle(0x0);
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
    this.displayRange = false;
    this.children.remove(this.children.getByName("movement-" + hero.getInternalHero().name));
    this.highlightedHero = null;
  }

  buildArrowPath(from: Coords, to: Coords, hero: Hero) {
    // todo: optimiser en mémoisant les résultats
    // todo: optimiser en prenant en compte le fait qu'on
    // a déjà la case de départ et d'arrivée
    // todo: optimiser en prenant en compte le fait qu'on
    // a déjà toutes nos cases
    let currentTile = from;
    let path = new Map<string, Coords>();
    let maxDistance = battle.getDistance(from, to);
    
    path.set(`${from.x}-${from.y}`, from);
    path.set(`${to.x}-${to.y}`, to);
    while (maxDistance) {
      const nearby = getNearby(currentTile).filter((tile) => {
        return this.heroCanReachTile(hero, tile) && battle.getDistance(tile, to) < maxDistance;
      });
      currentTile = nearby[0];
      maxDistance = battle.getDistance(to, nearby[0]);
      const { x, y } = currentTile;
      path.set(`${x}-${y}`, currentTile);
    }

    const x = Array.from(path.values()).sort((coordA, coordB) => {
      return battle.getDistance(coordA, from) - battle.getDistance(coordB, from);
    });
    return x;
  }

  killHero(hero: Hero) {
    this[hero.team] = this[hero.team].filter(({ name }) => name !== hero.name);
    this.heroes = this.heroes.filter(({ name }) => name !== hero.name);
    const { x, y } = pixelsToGrid(hero.x, hero.y);
    this.map[y][x] = null;
    this.children.remove(hero);
    battle.killHero(hero.getInternalHero());
    hero.destroy();
    hero = null;
  }

  setTurn(turn: "team1" | "team2") {
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
      let pathStart: GameObjects.Image;

      let previousSoundFile = "";
      let clickTimestamp = 0;
      
      hero.off("pointerdown");
      hero.on("drag", (_, dragX: number, dragY: number) => {
        hero.x = dragX;
        hero.y = dragY
      });
      hero.on("pointerdown", ({ event: { timeStamp } }) => {
        if (timeStamp - clickTimestamp <= dblClickMargin) {
          this.endAction(hero);
          return;
        }
        const internalHero = hero.getInternalHero();
        clickTimestamp = timeStamp;
        const currentCoords = pixelsToGrid(hero.x, hero.y);
        this.movementAllowedImages.setVisible(false);
        const img = this.children.getByName(`movement-${internalHero.name}`) as GameObjects.Image;
        img.setVisible(true);
        pathStart = this.add.image(img.x, img.y, "rosary").setDisplaySize(img.width, img.height).setScale(1.35).setName("arrow");
        this.movementAllowedTween.pause();
        this.sound.play("enabled-unit");
        const n = this.rng.integerInRange(1, 3);
        if (previousSoundFile) this.sound.stopByKey(previousSoundFile);
        const soundFile = internalHero.name + " quotes";
        this.sound.playAudioSprite(internalHero.name + " quotes", n.toString(), { volume: 0.2 });
        previousSoundFile = soundFile;
        this.unitInfosBanner.setVisible(true).setHero(hero);
        this.displayRanges(currentCoords, battle.getMovementRange(internalHero), battle.getWeaponRange(internalHero));
      });
      let previousTileString = "";
      let tilePath: string[] = [];
      // when dragging over a tile:
      // if tile is inside movement tiles, autocomplete based on existing tile path
      // if tile is inside attack tiles and there's an enemy inside: autocomplete based on existing tile path
      // if tile is inside attack tiles but there are no enemies inside: display arrow path (autocomplete from existing), but reset hero's position on drag end
      const endArrow = new GameObjects.Image(this, 0, 0, "end-arrow").setName("end-arrow");
      this.movementArrows.add(endArrow);
      let hoveredTile = "";
      hero.on("dragenter", (_, target: Phaser.GameObjects.Rectangle) => {
        if (target.name !== hoveredTile) {
          hoveredTile = target.name
        }
        if (this.walkCoords.includes(target.name) && target.name !== previousTileString) {
          this.combatForecast.setVisible(false);
          this.unitInfosBanner.setVisible(true);
          this.sound.play("hover");
          const targetTileXY = target.name.split('-').map(Number);
          const arrowPath = this.buildArrowPath({ ...currentCoords }, {
            x: targetTileXY[0],
            y: targetTileXY[1]
          }, hero);
          pathStart.setTexture("rosary");
          hero.getInternalHero().coordinates = arrowPath[arrowPath.length - 1];

          this.movementArrows.clear(true);
          for (let i = 0; i < arrowPath.length; i++) {
            const previousTile = arrowPath[i - 1];
            const tile = arrowPath[i];
            if (i) {
              this.add.existing(endArrow);
            }
            if (previousTile && arrowPath[i - 2]) {
              const previousTileDirections = getTilesDirection(arrowPath[i - 2], tile);
              const gameTile = this.getTile(previousTile.x + "-" + previousTile.y);
              var texture = !previousTileDirections.x ? "vertical" : !previousTileDirections.y ? "horizontal" : `path-${previousTileDirections.y}-${previousTileDirections.x}`;
              const img = new Phaser.GameObjects.Image(this, gameTile.x, gameTile.y, texture);
              this.add.existing(img);
              this.movementArrows.add(img);
            }
            if (i === 1) {
              const direction = getTilesDirection(previousTile, tile);
              const verticalAngle = direction.y === "up" ? 180 : direction.y === "down" ? 0 : null;
              const horizontalAngle = direction.x === "left" ? 90 : direction.x === "right" ? -90 : null;
              const angle = verticalAngle ?? horizontalAngle;
              pathStart.setTexture("rosary-arrow");
              pathStart.setRotation(angle * Math.PI / 180);
            }
            if (arrowPath.length === 1) {
              this.children.remove(this.children.getByName("end-arrow"));
            } else if (i === arrowPath.length - 1 && i) {
              const x = arrowPath[arrowPath.length - 1];
              const tile = this.getTile(x.x + "-" + x.y);
              endArrow.x = tile.x;
              endArrow.y = tile.y;
              const direction = getTilesDirection(previousTile, x);
              const horizontalAngle = direction.x === "left" ? 180 : direction.x === "right" ? 0 : null;
              const verticalAngle = direction.y === "up" ? -90 : direction.y === "down" ? 90 : null;
              const angle = horizontalAngle ?? verticalAngle;
              endArrow.setRotation(angle * Math.PI / 180);
            }
            // for each tile
            // if it has a tile before it, compare directions
            // if it has a tile after it, compare directions
            // assemble directions from both comparisons
            // and render path
          }
          previousTileString = target.name;
          (this.children.getByName(`movement-${hero.getInternalHero().name}`) as GameObjects.Image).x = target.x;
          (this.children.getByName(`movement-${hero.getInternalHero().name}`) as GameObjects.Image).y = target.y;
          this.interactionIndicator.setVisible(false);
        } else if (this.attackCoords.includes(target.name)) {
          const [x, y] = target.name.split("-");
          if ((this.map[+y][+x]?.team ?? hero.team) !== hero.team) {
            const opponent = this.map[+y][+x];
            this.unitInfosBanner.setVisible(false);
            this.interactionIndicator.x = opponent.image.getCenter().x + opponent.x;
            this.interactionIndicator.y = opponent.image.getTopCenter().y - 30 + opponent.y;
            this.interactionIndicator.setVisible(true);
            if (this.interactionIndicatorTween) {
              this.interactionIndicatorTween.stop();
            }
            this.interactionIndicatorTween = this.tweens.create({
              y: this.interactionIndicator.y - 10,
              loop: -1,
              yoyo: true,
              targets: this.interactionIndicator,
              duration: 400,
            });
            this.interactionIndicatorTween.play();
            const simulatedBattle = battle.startCombat(hero.getInternalHero(), opponent.getInternalHero());
            this.combatForecast.setForecastData({
              attacker: {
                hero,
                startHP: hero.getInternalHero().stats.hp,
                endHP: simulatedBattle.atkRemainingHP,
                statChanges: simulatedBattle.atkChanges,
                turns: simulatedBattle.atkTurns,
                effective: simulatedBattle.atkEffective,
                damage: simulatedBattle.atkDamage,
              },
              defender: {
                hero: opponent,
                startHP: opponent.getInternalHero().stats.hp,
                endHP: simulatedBattle.defRemainingHP,
                statChanges: simulatedBattle.defChanges,
                effective: simulatedBattle.defEffective,
                turns: simulatedBattle.defTurns,
                damage: simulatedBattle.defDamage,
              },
            });
            this.combatForecast.setVisible(true);
          }
        }
      });
      hero.off("dragend");
      hero.on("dragend", ({ upX, upY }: { upX: number; upY: number }) => {
        const { x: x2, y: y2 } = pixelsToGrid(upX, upY);
        this.movementArrows.setVisible(false);
        this.children.remove(this.children.getByName("arrow"));
        this.children.remove(this.children.getByName("end-arrow"));
        
        this.interactionIndicator.setVisible(false);
        if (this.walkCoords.includes(x2 + "-" + y2) && !this.map[y2][x2] && (currentCoords.x !== x2 || currentCoords.y !== y2)) {
          this.combatForecast.setVisible(false);
          this.unitInfosBanner.setVisible(true);
          this.clearTiles([...this.walkCoords, ...this.attackCoords]);
          this.map[currentCoords.y][currentCoords.x] = null;
          currentCoords.x = x2;
          currentCoords.y = y2;
          this.map[currentCoords.y][currentCoords.x] = hero;
          const pixelsCoords = gridToPixels(x2, y2);
          hero.x = pixelsCoords.x;
          hero.y = pixelsCoords.y;
          battle.moveHero(hero.getInternalHero(), { x: x2, y: y2 });
          this.movementArrows.setVisible(false);
          this.movementArrows.clear(true);
          this.movementAllowedImages.setVisible(true);
          this.movementAllowedTween.resume();
          (this.children.getByName(`movement-${hero.getInternalHero().name}`) as GameObjects.Image).setVisible(false);
          this.sound.play("confirm", { volume: 0.4 });
          this.endAction(hero);
          this.children.remove(endArrow);
        } else if (this.attackCoords.includes(x2 + "-" + y2) && this.map[y2][x2] && this.map[y2][x2].team !== hero.team) {
          const possibleLandingTiles = this.getTilesInShallowRange({ x: x2, y: y2 }, battle.getWeaponRange(hero.getInternalHero()));
          const coordsArray = [`${hero.getInternalHero().coordinates.x}-${hero.getInternalHero().coordinates.y}`];
          const overlap = getOverlap(Array.from(possibleLandingTiles.keys()), this.walkCoords);
          const [finalLandingTile] = overlap.length ? overlap : coordsArray;
          const [x, y] = finalLandingTile.split("-");
          if (this.map[+y][+x]) {
            const pixelCoords = gridToPixels(currentCoords.x, currentCoords.y);
          (this.children.getByName(`movement-${hero.getInternalHero().name}`) as GameObjects.Image).x = pixelCoords.x;
          (this.children.getByName(`movement-${hero.getInternalHero().name}`) as GameObjects.Image).y = pixelCoords.y;
          this.tweens.add({
            targets: hero,
            x: pixelCoords.x,
            y: pixelCoords.y,
            duration: 100
          });
          hero.getInternalHero().coordinates = {...currentCoords};
            return;
          }
          const [xCoord, yCoord] = finalLandingTile.split("-");
          this.moveHero(hero, currentCoords, { x: +xCoord, y: +yCoord });
          currentCoords.x = +xCoord;
          this.movementAllowedImages.setVisible(false);
          currentCoords.y = +yCoord;
          const target = this.map[y2][x2];
          const turns = battle.startCombat(hero.getInternalHero(), target.getInternalHero());
          const t = this.tweens.timeline();
          t.on("complete", () => {
            this.clearTiles([...this.walkCoords, ...this.attackCoords]);
            const deadUnit = [hero, target].find(h => h.getInternalHero().stats.hp === 0);
            if (deadUnit) {
              this.tweens.add({
                targets: deadUnit,
                alpha: 0,
                delay: 700,
                onStart: () => {
                  this.sound.play("ko", { volume: 0.4 });
                },
                onComplete: () => {
                  this.game.input.enabled = true;
                  if (hero.getInternalHero().stats.hp) {
                    this.endAction(hero);
                  }
                  this.children.remove(this.children.getByName("movement-" + deadUnit.getInternalHero().name));
                  this.killHero(deadUnit);
                  this.movementAllowedImages.setVisible(true);
                  this.movementAllowedTween.resume();
                  this.combatForecast.setVisible(false);
                }
              });
            } else {
              setTimeout(() => {
                this.combatForecast.setVisible(false);
                this.endAction(hero);
                this.game.input.enabled = true;
              }, 300);
            }
            const s = battle.getPostCombatEffects(hero.getInternalHero(), target.getInternalHero(), turns);
            for (let ef of s) {
              const h = this.children.getByName(ef.targetHeroId) as Hero;
              h.statuses.push("debuff");
              h.getInternalHero().setMapMods(ef.appliedEffect.stats);
            }
          });
          for (let i = 0; i < turns.outcome.length; i++) {
            const turn = turns.outcome[i];
            const defenderObject = this.children.getByName(turn.defender.id) as Hero;
            const attackerObject = this.children.getByName(turn.attacker.id) as Hero;
            const defCenter = defenderObject.image.getCenter();
            const damageText = renderText(this, defenderObject.x + defCenter.x, defenderObject.y + defCenter.y, turn.damage.toString(), {
              stroke: "#FFFFFF",
              strokeThickness: 5,
              color: "red",
              fontSize: turn.advantage === "advantage" || turn.effective ? "32px" : turn.advantage === "disadvantage" ? "25px" : "30px"
            }).setOrigin(0.4).setDepth(3);
            t.add({
              targets: attackerObject,
              x: `-=${(attackerObject.x - defenderObject.x) / 2}`,
              y: `-=${(attackerObject.y - defenderObject.y) / 2}`,
              yoyo: true,
              duration: 150,
              onStart: () => {
                this.sound.play("hit");
                defenderObject.image.setTintFill(0xFFFFFF);
                this.add.existing(damageText);
                this.tweens.add({
                  targets: [damageText],
                  y: defenderObject.image.getTopCenter().y + defenderObject.y,
                  yoyo: true,
                  duration: 100,
                  onComplete: () => {
                    defenderObject.image.tintFill = false;
                    setTimeout(() => {
                      damageText.destroy();
                    }, 500);
                  },
                  onStart: () => {
                    defenderObject.getInternalHero().stats.hp = turn.remainingHP;
                    const attackerRatio = hero.getInternalHero().stats.hp / attackerObject.getInternalHero().maxHP;
                    const defenderHPRatio = target.getInternalHero().stats.hp / defenderObject.getInternalHero().maxHP;
                    this.combatForecast.updatePortraits(attackerRatio, defenderHPRatio);
                  }
                });
              },
              delay: 600,
            });
          }
          this.game.input.enabled = false;
          t.play();
        } else {
          const pixelCoords = gridToPixels(currentCoords.x, currentCoords.y);
          (this.children.getByName(`movement-${hero.getInternalHero().name}`) as GameObjects.Image).x = pixelCoords.x;
          (this.children.getByName(`movement-${hero.getInternalHero().name}`) as GameObjects.Image).y = pixelCoords.y;
          // (this.children.getByName(`movement-${hero.getInternalHero().name}`) as GameObjects.Image).setVisible(true);
          this.tweens.add({
            targets: hero,
            x: pixelCoords.x,
            y: pixelCoords.y,
            duration: 100
          });
          hero.getInternalHero().coordinates = {...currentCoords};
        }
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
      hero.off("pointerdown");
      hero.on("pointerdown", () => {
        this.displayRanges(pixelsToGrid(hero.x, hero.y), battle.getMovementRange(hero.getInternalHero()), battle.getWeaponRange(hero.getInternalHero()));
        this.sound.play("enabled-unit");
        this.highlightedHero = hero;
        this.unitInfosBanner.setVisible(true).setHero(hero);
      });
    }

    for (let effect of effects) {
      const target = this.children.getByName(effect.targetHeroId) as Hero;
      if (target && effect.appliedEffect.stats) {
        target.getInternalHero().setMapMods(effect.appliedEffect.stats);
        target.statuses.push("buff");
      }
    }
  }

  preload() {
    this.load.image("map", "assets/map.webp");
    this.load.image("movement-allowed", "assets/movement-allowed.png");
    this.load.atlas("weapons", "assets/sheets/weapons.webp", "assets/sheets/weapons.json");
    this.load.atlas("skills", "assets/sheets/skills.webp", "assets/sheets/skills.json");
    this.load.atlas("interactions", "assets/sheets/interactions.webp", "assets/sheets/interactions.json");
    this.load.audio("enabled-unit", "assets/audio/pointer-tap.mp3");
    this.load.audio("disabled-unit", "assets/audio/feh disabled unit.mp3");
    this.load.audio("hit", "assets/audio/hit.mp3");
    this.load.audio("ko", "assets/audio/ko.mp3");
    this.load.image("background", "assets/unit-bg-test.png");
    this.load.audio("hover", "assets/audio/hover on tile.mp3");
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
    this.load.image("weapon-bg", "assets/weapon.png");
    this.load.image("unit-banner-bg", "assets/unit-banner-bg.png");
    this.load.image("forecast-bg", "assets/forecast-bg.png");
    this.load.image("assist-icon", "assets/assist-icon.png");
    this.load.image("special-icon", "assets/special-icon.png");
    // todo: compress into audio sprite
    this.load.audio("bgm", "assets/audio/leif's army in search of victory.ogg");
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

  // todo: simplify signature
  addHero(config: { hero: HeroData } & Coords, team: "team1" | "team2") {
    const { x, y } = gridToPixels(config.x, config.y);
    const hero = new Hero(this, x, y, config.hero, team).setInteractive();
    this.add.existing(hero);
    this.heroes.push(hero);
    this.map[config.y][config.x] = hero;
    this[team].push(hero);
    hero.setDepth(1);
    return hero;
  }

  moveHero(hero: Hero, from: Coords, destination: Coords) {
    this.map[from.y][from.x] = null;
    this.map[destination.y][destination.x] = hero;
    const { x, y } = gridToPixels(destination.x, destination.y);
    hero.x = x;
    hero.y = y;
  }

  getNearestToAttackTile(hero: Hero, tileCoords: Coords) {
    const eligibleTiles = this.getTilesInShallowRange(tileCoords, battle.getWeaponRange(hero.getInternalHero()));
    if (!eligibleTiles.size) return null;
    return eligibleTiles;
  }

  startBackgroundMusic(volume: number) {
    const bgm = this.sound.add("bgm");
    const loopPoint = bgm.addMarker({
      name: "loop",
      start: 4.25
    });
    bgm.play({ volume });
    bgm.on("complete", () => {
      bgm.play("loop", { volume });
    });
  };

  create() {
    this.movementAllowedImages = this.add.group();
    this.movementArrows = this.add.group();
    this.add.rectangle(0, 180, 750, 1000, 0xFFFFFF).setOrigin(0);
    const banner = this.add.image(-90, 0, "background").setOrigin(0).setTint(0x0F343D);
    this.startBackgroundMusic(0.13);
    banner.setDisplaySize(banner.displayWidth, 180);
    this.combatForecast = this.add.existing(new CombatForecast(this).setVisible(false));
    this.add.image(0, 180, "map").setDisplaySize(750, 1000).setOrigin(0, 0).setDepth(0);
    for (let y = 1; y < 9; y++) {
      for (let x = 1; x < 7; x++) {
        const { x: screenX, y: screenY } = gridToPixels(x, y);
        const name = x + "-" + y;
        const r = this.add.rectangle(screenX, screenY, squareSize, squareSize, 0x0).setAlpha(0.2).setName(name).setInteractive(undefined, undefined, true);
        r.on("pointerdown", () => {
          const [x, y] = name.split("-");
          if (!this.map[+y][+x]) {
            this.clearTiles([...this.walkCoords, ...this.attackCoords]);
            if (this.displayRange) {
              this.sound.play("disabled-unit");
            }
            this.displayRange = false;
            this.movementAllowedImages.setVisible(true);
            this.movementAllowedTween.resume();
            this.movementArrows.clear(true);
          }
        });
        // uncomment if you need to check tile coordinates
        // this.add.text(r.getCenter().x, r.getCenter().y, name, {
        //   fontSize: "18px"
        // });
      }
    }
    
    for (let { hero, x, y } of battle.team1) {
      this.addHero({ x, y, hero }, "team1");
    }

    for (let { hero, x, y } of battle.team2) {
      this.addHero({
        hero,
        x,
        y,
      }, "team2");
    }

    this.setTurn("team1");
    this.interactionIndicator = this.add.existing(new InteractionIndicator(this, 0, 0).setVisible(false).setDepth(5));
    this.unitInfosBanner = this.add.existing(new UnitInfosBanner(this).setVisible(false)).setDepth(1);
    this.fpsText = renderText(this, 500, 120, "", { fontSize: "25px" });
}

  displayRanges(coords: Coords, walkingRange: number, weaponRange: number) {
    this.displayRange = true;
    const walkTiles = this.getTilesInRange(coords, walkingRange);
    for (let [key, tile] of walkTiles.entries()) {
      if (!this.heroCanReachTile(this.map[coords.y][coords.x], tile)) {
        walkTiles.delete(key);
      }
    }
    const weaponTiles = this.getTilesInRange(coords, weaponRange, walkTiles, true);
    const attackRange = getDiff(walkTiles, weaponTiles);

    const newWalkTiles = Array.from(walkTiles.keys());
    const newAttackTiles = Array.from(attackRange.keys());

    for (let t of this.walkCoords) {
      if (!newWalkTiles.includes(t)) {
        this.getTile(t).setFillStyle(0);
      }
    }

    for (let t of this.attackCoords) {
      if (!newAttackTiles.includes(t)) {
        this.getTile(t).setFillStyle(0);
      }
    }

    this.walkCoords = newWalkTiles;
    this.attackCoords = newAttackTiles;
    this.fillTiles(this.walkCoords, 0x0000FF);
    this.fillTiles(this.attackCoords, 0xFF0000);
  }

  getTile(name: string) {
    return this.children.getByName(name) as Phaser.GameObjects.Rectangle;
  }

  // todo: try to split function into distinct ones for walking and attacking
  getTilesInRange(tile: Coords, range: number, existingTiles?: Map<string, Coords>, checkForAttacks?: boolean) {
    let tiles = existingTiles ? Array.from(existingTiles.values()) : [tile];
    const tileset = existingTiles ? new Map(existingTiles || undefined) : new Map<string, Coords>();
    const hero = this.map[tile.y][tile.x];

    for (let i = 0; i < range; i++) {
      tiles = tiles.map(getNearby).flat();
      if (!checkForAttacks) {
        tiles = tiles.filter((testedTile) => {
          return this.heroCanReachTile(hero, testedTile);
        });
      }
    }

    for (let tile of tiles) {
      if (!tileset.has(`${tile.x}-${tile.y}`)) {
        tileset.set(`${tile.x}-${tile.y}`, tile);
      }
    }

    return tileset;
  }

  getTilesInShallowRange(tile: Coords, range: number) {
    const tilesInRange = this.getTilesInRange(tile, range);
    tilesInRange.forEach((recordedTile, tileKey) => {
      if (battle.getDistance(recordedTile, tile) !== range) {
        tilesInRange.delete(tileKey);
      }
    });

    return tilesInRange;
  }

  heroCanReachTile(hero: Hero, tile: Coords) {
    const occupying = this.map[tile.y][tile.x];
    if (Boolean(occupying) && occupying.team !== hero.team) return false;
    const tileType = this.terrain[tile.y - 1][tile.x - 1];
    if (tileType === "wall") return false;
    if (tileType === "void") return hero.getInternalHero().movementType === "flier";
    if (hero.getInternalHero().movementType === "flier") return true;
    const { x, y } = pixelsToGrid(hero.x, hero.y);
    if (hero.getInternalHero().movementType === "cavalry" && tileType === "trench") return battle.getDistance({ x, y }, tile) <= 1;
    if (tileType === "tree") {
      switch (hero.getInternalHero().movementType) {
        case "cavalry": return false;
        case "infantry": return battle.getDistance({ x, y }, tile) <= 1;
        default: return true;
      }
    }

    return true;
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

function isValid(tile: Coords) {
  return tile.x >= 1 && tile.x <= 6 && tile.y >= 1 && tile.y <= 8;
}

function getNearby(coords: Coords) {
  const { x, y } = coords;
  const nearbyTiles = [coords];

  nearbyTiles.push({
    x: x + 1,
    y
  });

  nearbyTiles.push({
    x: x-1,
    y
  });

  nearbyTiles.push({
    x,
    y: y + 1
  });

  nearbyTiles.push({
    x,
    y: y-1
  });

  return nearbyTiles.filter(isValid);
};

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

function getOverlap<T>(array1: T[], array2: T[]) {
  const overlap: T[] = [];
  for (let key of array1) {
    if (array2.includes(key)) {
      overlap.push(key);
    }
  }

  for (let key of array2) {
    if (array1.includes(key)) {
      overlap.push(key);
    }
  }

  return Array.from(new Set(overlap));
}
