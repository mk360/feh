import { GameObjects } from 'phaser';
import Hero from '../objects/hero';
import TileType from '../../types/tiles';
import WeaponType from '../../types/WeaponType';
import MovementType from '../../types/MovementType';
import UnitInfosBanner from '../objects/unit-infos-banner';
import { renderText } from '../utils/text-renderer';
import Stats from '../../interfaces/stats';
import CombatForecast from '../objects/combat-forecast';

interface Coords {
  x: number;
  y: number;
}

const squareSize = 125;
const squaresOffset = 63;
const fixedY = 90;

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

// store the "allowed movement" graphic in an array,
// hide all of them except the moving unit
// make the graphic follow the unit when they're dragged around
// put the rosary graphic where the unit was

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
  heroDetails: Phaser.GameObjects.Container;
  heroPortrait: Phaser.GameObjects.Image;
  heroBackground: Phaser.GameObjects.Rectangle;
  heroName: Phaser.GameObjects.Text;
  heroWeapon: Phaser.GameObjects.Image;
  heroStats: Phaser.GameObjects.Text[];
  heroSkills: Phaser.GameObjects.Image[];
  movementAllowedImages: Phaser.GameObjects.Group;
  movementAllowedTween: Phaser.Tweens.Tween;
  movementArrows: Phaser.GameObjects.Group;
  combatForecast: CombatForecast;

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

  constructor() {
    super({ key: 'MainScene' });
    // todo: refactor into a number-indexed object, maybe?
    for (let i = 0; i < 9; i++) {
      const newArray = Array.from<Hero | null>({ length: 6 }).fill(null);
      this.map.push(newArray);
    }
  }

  endAction(hero: Hero) {
    hero.image.setTint(0x777777);    
    hero.disableInteractive();
    this.heroesWhoMoved.push(hero);
    this.displayRange = false;
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
    let maxDistance = this.getDistance(from, to);
    
    path.set(`${from.x}-${from.y}`, from);
    path.set(`${to.x}-${to.y}`, to);
    while (maxDistance) {
      const nearby = getNearby(currentTile).filter((tile) => {
        return this.heroCanReachTile(hero, tile) && this.getDistance(tile, to) < maxDistance;
      });
      currentTile = nearby[0];
      maxDistance = this.getDistance(to, nearby[0]);
      const { x, y } = currentTile;
      path.set(`${x}-${y}`, currentTile);
    }

    const x = Array.from(path.values()).sort((coordA, coordB) => {
      return this.getDistance(coordA, from) - this.getDistance(coordB, from);
    });
    return x;
  }

  setTurn(turn: "team1" | "team2") {
    this.movementAllowedImages.clear();
    const otherTeam = turn === "team1" ? "team2" : "team1";
    this.turn = turn;
    this.heroesWhoMoved = [];
    for (let hero of this[turn]) {
      const { x, y } = pixelsToGrid(hero.x, hero.y);
      let currentCoords: Coords = { x, y };
      hero.setInteractive(true);
      this.input.setDraggable(hero, true);
      const img = new Phaser.GameObjects.Image(this, hero.x, hero.y, "movement-allowed").setName(`movement-${hero.name}`);
      this.add.existing(img);
      const matchingTile = this.getTile(currentCoords.x + "-" + currentCoords.y);      
      img.setDisplaySize(matchingTile.width, matchingTile.height);
      this.movementAllowedImages.add(img);
      let pathStart: GameObjects.Image;

      let previousSoundFile = "";
      hero.off("pointerdown");
      hero.on("pointerdown", () => {
        this.movementAllowedImages.setVisible(false);
        const img = this.children.getByName(`movement-${hero.name}`) as GameObjects.Image;
        img.setVisible(true);
        pathStart = this.add.image(img.x, img.y, "rosary").setDisplaySize(img.width, img.height).setScale(1.35).setName("arrow");
        this.movementAllowedTween.pause();
        this.sound.play("enabled-unit");
        const currentCoords = pixelsToGrid(hero.x, hero.y);
        const n = this.rng.integerInRange(1, 3);
        if (previousSoundFile) this.sound.stopByKey(previousSoundFile);
        const soundFile = `${hero.unitData.name} ${n}`;
        this.sound.play(soundFile, { volume: 0.2 });
        previousSoundFile = soundFile;
        // this.unitInfosBanner.setVisible(true).setHero(hero);
        this.displayRanges(currentCoords, hero.getMovementRange(), hero.getWeaponRange());
      });
      let previousTileString = "";
      const endArrow = new GameObjects.Image(this, 0, 0, "end-arrow").setName("end-arrow");
      this.movementArrows.add(endArrow);
      hero.on("dragover", (_, target: Phaser.GameObjects.Rectangle) => {
        if (this.walkCoords.includes(target.name) && target.name !== previousTileString) {
          this.sound.play("hover");
          const targetTileXY = target.name.split('-').map(Number);
          const arrowPath = this.buildArrowPath({ ...currentCoords }, {
            x: targetTileXY[0],
            y: targetTileXY[1]
          }, hero);
          pathStart.setTexture("rosary");

          this.movementArrows.clear(true);
          for (let i = 0; i < arrowPath.length; i++) {
            const previousTile = arrowPath[i - 1];
            const tile = arrowPath[i];
            if (i) {
              this.add.existing(endArrow);
            }
            if (previousTile && arrowPath[i - 2]) {
              const previousTileDirections = getTilesDirection(arrowPath[i - 2], tile);
              console.log("previousDirections", previousTile, previousTileDirections);
              console.log("previous to the previous", arrowPath[i - 2]);
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
            if (i === arrowPath.length - 1 && i) {
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
        }
      });
      hero.off("dragend");
      hero.on("dragend", ({ upX, upY }: { upX: number; upY: number }) => {
        const { x: x2, y: y2 } = pixelsToGrid(upX, upY);
        this.children.remove(this.children.getByName("arrow"));
        if (this.walkCoords.includes(x2 + "-" + y2) && !this.map[y2][x2] && (currentCoords.x !== x2 || currentCoords.y !== y2)) {
          this.map[currentCoords.y][currentCoords.x] = null;
          currentCoords.x = x2;
          currentCoords.y = y2;
          this.map[currentCoords.y][currentCoords.x] = hero;
          const pixelsCoords = gridToPixels(x2, y2);
          hero.x = pixelsCoords.x;
          hero.y = pixelsCoords.y;
          this.movementAllowedImages.setVisible(true);
          this.movementAllowedTween.resume();
          (this.children.getByName(`movement-${hero.name}`) as GameObjects.Image).setVisible(false);
          this.sound.play("confirm", { volume: 0.4 });
          this.endAction(hero);
          this.children.remove(endArrow);
          this.movementArrows.clear(true);
        } else if (this.attackCoords.includes(x2 + "-" + y2) && this.map[y2][x2] && this.map[y2][x2].team !== hero.team) {
          const possibleLandingTiles = this.getTilesInShallowRange({ x: x2, y: y2 }, hero.getWeaponRange());
          const [finalLandingTile] = getOverlap(Array.from(possibleLandingTiles.keys()), this.walkCoords);
          const [xCoord, yCoord] = finalLandingTile.split("-");
          this.moveHero(hero, currentCoords, { x: +xCoord, y: +yCoord });
          currentCoords.x = +xCoord;
          currentCoords.y = +yCoord;
          const target = this.map[y2][x2];
          const turns = hero.attack(target);
          const t = this.tweens.timeline();
          t.on("complete", () => {
            const deadUnit = [hero, target].find(h => h.HP === 0);
            const survivingUnit = [hero, target].find(h => !!h.HP);
            if (deadUnit) {
              this.tweens.add({
              targets: deadUnit,
              alpha: 0,
              delay: 700,
              onStart: () => {
                this.sound.play("ko", { volume: 0.4 });
              },
              onComplete: () => {
                this.displayRange = false;
                this.heroes = this.heroes.filter(h => h.name !== deadUnit.name);
                this[deadUnit.team] = this[deadUnit.team].filter(h => h.name !== deadUnit.name);
                const { x, y } = pixelsToGrid(deadUnit.x, deadUnit.y);
                this.map[y][x] = null;
                deadUnit.destroy();
                if (survivingUnit.team === this.turn) {
                  this.endAction(survivingUnit);
                }
                this.game.input.enabled = true;
              },
              duration: 900
            });
            } else {
              this.endAction(hero);
              this.game.input.enabled = true;
            }
          });
          for (let i = 0; i < turns.length; i++) {
            const turn = turns[i];
            const tweenDelay = 900 * i + 40;
            const defCenter = turn.defender.image.getCenter();
            const damageText = renderText(this, turn.defender.x + defCenter.x, turn.defender.y + defCenter.y, turn.damage.toString(), {
              stroke: "#FFFFFF",
              strokeThickness: 5,
              color: "red",
              fontSize: "30px"
            }).setOrigin(0.4);
            t.add({
              targets: turn.attacker,
              x: `-=${(turn.attacker.x - turn.defender.x) / 2}`,
              y: `-=${(turn.attacker.y - turn.defender.y) / 2}`,
              yoyo: true,
              duration: 100,
              onStart: () => {
                this.sound.play("hit");
                turn.defender.HP = Math.max(0, turn.defender.HP - turn.damage);
                this.add.existing(damageText);
                this.tweens.add({
                  targets: [damageText],
                  y: turn.defender.image.getTopCenter().y + turn.defender.y,
                  yoyo: true,
                  duration: 100,
                  onComplete: () => {
                    setTimeout(() => {
                      damageText.destroy();
                    }, 500);
                  }
                });
              },
              delay: tweenDelay,
            });
          }
          this.game.input.enabled = false;
          t.play();
        } else {
          const pixelCoords = gridToPixels(currentCoords.x, currentCoords.y);
          this.tweens.add({
            targets: hero,
            x: pixelCoords.x,
            y: pixelCoords.y,
            duration: 100
          });
          // hero.x = pixelCoords.x;
          // hero.y = pixelCoords.y;
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
      hero.setInteractive();
      this.children.remove(this.children.getByName("movement-" + hero.name));
      hero.image.clearTint();
      this.input.setDraggable(hero, false);
      hero.off("dragstart");
      hero.off("pointerdown");
      hero.on("pointerdown", () => {
        this.displayRanges(pixelsToGrid(hero.x, hero.y), hero.getMovementRange(), hero.getWeaponRange());
        this.sound.play("enabled-unit");
        this.highlightedHero = hero;
        this.unitInfosBanner.setVisible(true).setHero(hero);
      });
    }
  }

  preload() {
    this.load.image("map", "/assets/testmap.png");
    this.load.image("Byleth", "/assets/mini/Byleth.png");
    this.load.image("Dimitri", "/assets/mini/Dimitri.png");
    this.load.image("Chrom", "/assets/mini/Chrom.png");
    this.load.image("Lucina", "/assets/mini/Lucina.png");
    this.load.image("movement-allowed", "/assets/movement-allowed.png");
    this.load.image("sword", "/assets/sword.png");
    this.load.image("lance", "/assets/lance.png");
    this.load.audio("enabled-unit", "/assets/audio/q.mp3");
    this.load.audio("disabled-unit", "/assets/audio/feh disabled unit.mp3");
    this.load.audio("hit", "/assets/audio/hit.mp3");
    this.load.audio("ko", "/assets/audio/ko.mp3");
    this.load.audio("hover", "/assets/audio/hover on tile.mp3");
    this.load.audio("confirm", "/assets/audio/confirm.mp3");
    this.load.image("nameplate", "/assets/nameplate.png");
    this.load.image("end-arrow", "/assets/end-arrow.png");
    this.load.image("empty-skill", "/assets/empty-skill.png");
    this.load.image("path-down-right", "/assets/path-down-left.png");
    this.load.image("path-down-left", "/assets/path-down-right.png");
    this.load.image("path-up-right", "/assets/path-up-right.png");
    this.load.image("path-up-left", "/assets/path-up-left.png");
    this.load.image("horizontal", "/assets/horizontal.png");
    this.load.image("vertical", "/assets/vertical.png");
    this.load.image("unit-bg", "/assets/unitbg.png");
    this.load.image("rosary", "/assets/rosary-current.png");
    this.load.image("rosary-arrow", "/assets/rosary-arrow.png");
    this.load.image("weapon-icon", "/assets/weapon_icon.png");
    this.load.image("weapon-bg", "/assets/weapon.png");
    this.load.image("assist-icon", "/assets/assist-icon.png");
    this.load.image("special-icon", "/assets/special-icon.png");
    // todo: compress into audio sprite
    this.load.audio("bgm", "/assets/audio/leif's army in search of victory.mp3");
    for (let hero of ["Chrom", "Byleth", "Dimitri", "Lucina"]) {
      this.load.audio(`${hero} 1`, `/assets/audio/quotes/${hero}_1.wav`);
      this.load.audio(`${hero} 2`, `/assets/audio/quotes/${hero}_2.wav`);
      this.load.audio(`${hero} 3`, `/assets/audio/quotes/${hero}_3.wav`);
      this.load.image(`${hero} battle`, `/assets/battle/${hero}.png`);
    }
    for (let slot of ["A", "B", "C", "S"]) {
      this.load.image(slot, `/assets/${slot}.png`);
    }
  }

  // todo: simplify signature
  addHero(config: Omit<Stats, "hp"> & { name: string; weaponName: string; gridX: number; gridY: number; weaponType: WeaponType; movementType: MovementType; maxHP: number }, team: "team1" | "team2") {
    const { x, y } = gridToPixels(config.gridX, config.gridY);
    const hero = new Hero(this, x, y, config, team).setInteractive();
    this.add.existing(hero);
    this.heroes.push(hero);
    this.map[config.gridY][config.gridX] = hero;
    this[team].push(hero);
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
    const eligibleTiles = this.getTilesInShallowRange(tileCoords, hero.getWeaponRange());
    if (!eligibleTiles.size) return null;
    return eligibleTiles;
  }

  create() {
    this.movementAllowedImages = this.add.group();
    this.movementArrows = this.add.group();
    this.heroBackground = this.add.rectangle(0, 0, 1500, 400, 0x1F6589);
    this.unitInfosBanner = this.add.existing(new UnitInfosBanner(this).setVisible(false));
    this.combatForecast = this.add.existing(new CombatForecast(this).setVisible(true));
    this.sound.play("bgm", { volume: 0.1, loop: true });
    this.add.image(0, 150, "map").setDisplaySize(750, 1000).setOrigin(0, 0);

    for (let y = 1; y < 9; y++) {
      for (let x = 1; x < 7; x++) {
        const { x: screenX, y: screenY } = gridToPixels(x, y);
        const name = x + "-" + y;
        const r = this.add.rectangle(screenX, screenY, squareSize, squareSize, 0x0).setAlpha(0.2).setName(name).setInteractive(undefined, undefined, true);
        r.on("pointerdown", () => {
          const [x, y] = name.split("-");
          if (this.walkCoords.includes(name) && this.highlightedHero) {
            const { x: pxX, y: pxY } = gridToPixels(+x, +y);
            this.tweens.add({
              targets: this.highlightedHero,
              x: pxX,
              y: pxY,
              duration: 200
            });
          } else if (!this.map[+y][+x]) {
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
        this.add.text(r.getCenter().x, r.getCenter().y, name, {
          fontSize: "18px"
        });
      }
    }

    this.addHero({
      name: "Dimitri",
      weaponName: "Areadbhar",
      gridX: 3,
      gridY: 7,
      weaponType: "lance",
      movementType: "cavalry",
      maxHP: 40,
      atk: 57,
      def: 37,
      res: 18,
      spd: 41
    }, "team1");

    this.addHero({
      name: "Byleth",
      gridX: 3,
      weaponName: "Sword of the Creator",
      gridY: 1,
      weaponType: "sword",
      movementType: "infantry",
      maxHP: 40,
      atk: 52,
      def: 34,
      spd: 38,
      res: 20
    }, "team1");

    this.addHero({
      name: "Chrom",
      gridX: 6,
      gridY: 1,
      weaponName: "Revenge Falchion",
      weaponType: "sword",
      movementType: "infantry",
      atk: 57,
      def: 33,
      res: 19,
      maxHP: 49,
      spd: 27
    }, "team2");
    
    this.addHero({
      name: "Lucina",
      weaponName: "Parallel Falchion",
      gridX: 6,
      gridY: 4,
      weaponType: "sword",
      movementType: "infantry",
      atk: 50,
      def: 25,
      spd: 36,
      maxHP: 43,
      res: 19
    }, "team2");

    this.input.on("drag", (_, d: Hero, dragX: number, dragY: number) => {
      if (d instanceof Hero && d.team === this.turn) {
        d.x = dragX;
        d.y = dragY;
      }
    });

    this.setTurn("team1");
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
      if (this.getDistance(recordedTile, tile) !== range) {
        tilesInRange.delete(tileKey);
      }
    });

    return tilesInRange;
  }

  getDistance(tile1: Coords, tile2: Coords) {
    return Math.abs(tile1.x - tile2.x) + Math.abs(tile1.y - tile2.y);
  }

  heroCanReachTile(hero: Hero, tile: Coords) {
    const occupying = this.map[tile.y][tile.x];
    if (Boolean(occupying) && occupying.team !== hero.team) return false;
    const tileType = this.terrain[tile.y - 1][tile.x - 1];
    if (tileType === "wall") return false;
    if (tileType === "void") return hero.unitData.movementType === "flier";
    if (hero.unitData.movementType === "flier") return true;
    const { x, y } = pixelsToGrid(hero.x, hero.y);
    if (hero.unitData.movementType === "cavalry" && tileType === "trench") return this.getDistance({ x, y }, tile) <= 1;
    if (tileType === "tree") {
      switch (hero.unitData.movementType) {
        case "cavalry": return false;
        case "infantry": return this.getDistance({ x, y }, tile) <= 1;
        default: return true;
      }
    }

    return true;
  }

  update() {
    if (this.displayRange) {
      for (let i of this.walkCoords) {
        (this.children.getByName(i) as GameObjects.Rectangle).setFillStyle(0x0000FF);
      }

      for (let i of this.attackCoords) {
        (this.children.getByName(i) as GameObjects.Rectangle).setFillStyle(0xFF0000);
      }
    } else {
      for (let i of [...this.attackCoords, ...this.walkCoords]) {
        this.getTile(i).setFillStyle(0x0);
      }
      this.walkCoords = [];
      this.attackCoords = [];
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
  const arr: T[] = [];
  for (let key of array1) {
    if (array2.includes(key)) {
      arr.push(key);
    }
  }

  for (let key of array2) {
    if (array1.includes(key)) {
      arr.push(key);
    }
  }

  return Array.from(new Set(arr));
}
