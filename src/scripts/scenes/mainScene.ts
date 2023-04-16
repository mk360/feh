import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'
import { GameObjects, Tweens } from 'phaser';
import Hero from '../objects/hero';

interface Coords {
  x: number;
  y: number;
}

function gridToPixels(x: number, y: number) {
  return {
    x: x * 60 - 30,
    y: y * 60 - 30,
  }
}

function pixelsToGrid(x: number, y: number) {
  return {
    x: Math.round((x + 30) / 60) >> 0,
    y: Math.round((y + 30) / 60) >> 0
  };
}

export default class MainScene extends Phaser.Scene {
  map: (Hero | null)[][] = Array.from<(Hero | null)[]>({ length: 8 }).fill(Array.from<Hero | null>({ length: 6 }).fill(null));
  walkCoords: string[] = [];
  attackCoords: string[] = [];
  displayRange = false;
  heroes: Hero[] = [];
  highlightedHero: Hero;

  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    this.load.image("map", "assets/testmap.png");
    this.load.image("byleth m", "assets/byleth m.png");
    this.load.image("sylvain", "assets/sylvain.png");
    this.load.image("chrom", "assets/chrom.png");
    this.load.image("movement-allowed", "assets/movement-allowed.png");
    this.load.image("sword", "assets/sword.png");
    this.load.image("lance", "assets/lance.png");
    this.load.atlas("digits", "/assets/spritesheets/digits.png", "/assets/spritesheets/digits.json");
  }

  addHero(config: { name: string; gridX: number; gridY: number; weaponType: string; movementType: string; atk: number; def: number; maxHP: number }) {
    const { x, y } = gridToPixels(config.gridX, config.gridY);
    const hero = new Hero(this, x, y, config).setInteractive();
    this.input.setDraggable(hero);
    this.add.existing(hero);
    this.heroes.push(hero);
    console.log(this.map);
    this.map[config.gridY][config.gridX] = hero;
    let currentCoords: Coords = { x: config.gridX, y: config.gridY };

    hero.on("dragstart", () => {
      this.displayRanges(currentCoords, hero.getMovementRange(), hero.getWeaponRange());
    });

    hero.on("dragend", ({ upX, upY }: { upX: number; upY: number }) => {
      const { x: x2, y: y2 } = pixelsToGrid(upX, upY);
      if (this.walkCoords.includes(x2 + "-" + y2)) {
        currentCoords.x = x2;
        currentCoords.y = y2;
        const pixelsCoords = gridToPixels(x2, y2);
        hero.x = pixelsCoords.x;
        hero.y = pixelsCoords.y;
        this.displayRanges({ x: x2, y: y2 }, hero.getMovementRange(), hero.getWeaponRange());
      } else {
        const pixelCoords = gridToPixels(currentCoords.x, currentCoords.y);
        hero.x = pixelCoords.x;
        hero.y = pixelCoords.y;
      }
    });

    hero.on("pointerdown", () => {
      this.highlightedHero = hero;
      this.displayRanges(currentCoords, hero.getMovementRange(), hero.getWeaponRange());
    });

    hero.on("dragover", (_, x, y: Phaser.GameObjects.GameObject) => {
      console.log(y?.name, x.name)
    });

    return hero;
  }

  getNearestToAttackTile(hero: Hero, tileCoords: Coords) {
    const eligibleTiles = this.getTilesInShallowRange(tileCoords, hero.getWeaponRange());
    if (!eligibleTiles.size) return null;
    return eligibleTiles;
  }

  create() {
    this.add.image(0, 0, "map").setOrigin(0, 0);
    for (let y = 1; y < 9; y++) {
      for (let x = 1; x < 7; x++) {
        const { x: screenX, y: screenY } = gridToPixels(x, y);
        const name = x + "-" + y;
        const r = this.add.rectangle(screenX, screenY, 50, 50, 0x0).setName(name).setInteractive(undefined, undefined, true);
        r.on("dragover", () => {

          console.log(name);
        });
        r.on("pointerdown", () => {
          console.log(name);
          if (this.walkCoords.includes(name) && this.highlightedHero) {
            const [x, y] = name.split("-");
            const { x: pxX, y: pxY } = gridToPixels(+x, +y);
            this.tweens.add({
              targets: this.highlightedHero,
              x: pxX,
              y: pxY,
              duration: 200
            });
          } else {
            this.displayRange = false;
          }
        });
        this.add.text(r.getCenter().x, r.getCenter().y, name, {
          fontSize: "8px"
        });
      }
    }

    const sylvain = this.addHero({
      name: "sylvain",
      gridX: 1,
      gridY: 5,
      weaponType: "lance",
      movementType: "cavalry",
      maxHP: 51,
      atk: 36,
      def: 15
    });

    const byleth = this.addHero({
      name: "byleth m",
      gridX: 3,
      gridY: 1,
      weaponType: "sword",
      movementType: "infantry",
      maxHP: 40,
      atk: 24,
      def: 20
    });

    this.addHero({
      name: "chrom",
      gridX: 6,
      gridY: 1,
      weaponType: "sword",
      movementType: "infantry",
      atk: 41,
      def: 35,
      maxHP: 60
    });

     this.input.on("drag", (_, d: Hero, dragX: number, dragY: number) => {
      if (d instanceof Hero) {
        d.x = dragX;
        d.y = dragY;
      }
     });
  }

  displayRanges(coords: Coords, walkingRange: number, weaponRange: number) {
    this.displayRange = true;
    const walkTiles = this.getTilesInRange(coords, walkingRange);
    const weaponTiles = this.getTilesInRange(coords, weaponRange, walkTiles);
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

  getTilesInRange(tile: Coords, range: number, existingTiles?: Map<string, Coords>) {
    let tiles = existingTiles ? Array.from(existingTiles.values()) : [tile];
    const tileset = existingTiles ? new Map(existingTiles || undefined) : new Map<string, Coords>();

    for (let i = 0; i < range; i++) {
      tiles = tiles.map(getNearby).flat();
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
