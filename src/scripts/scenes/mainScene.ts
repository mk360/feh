import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'
import { GameObjects } from 'phaser';

interface Hero {
  name: string;
  hp: number;
}

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
  x: number;

  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    this.load.image("map", "assets/testmap.png");
    this.load.image("byleth", "assets/byleth m.png");
    this.load.image("sylvain", "assets/sylvain.png");
  }

  create() {
    this.add.image(0, 0, "map").setOrigin(0, 0);
    for (let y = 1; y < 9; y++) {
      for (let x = 1; x < 7; x++) {
        const { x: screenX, y: screenY } = gridToPixels(x, y);
        const r = this.add.rectangle(screenX, screenY, 50, 50, 0x333).setName(x + '-' + y).setInteractive();
        r.on("collide", () => {
          r.setFillStyle(0x00FF00);
        });
        this.add.text(r.getCenter().x, r.getCenter().y, x + '-' + y, {
          fontSize: "8px"
        });
      }
    }

    const { x, y } = gridToPixels(4, 1);

     const byleth = this.add.sprite(x, y, "byleth").setScale(0.7).setInteractive();
     let previousCoords = pixelsToGrid(byleth.x, byleth.y);
     this.input.setDraggable(byleth);
     this.input.on("drag", (_, d: typeof byleth, dragX: number, dragY: number) => {
      d.x = dragX;
      d.y = dragY;
     });
     this.input.on("dragend", (_, endCoords: { x: number, y: number }) => {
       const { x: a, y: b } = pixelsToGrid(endCoords.x, endCoords.y);
      this.getTile(previousCoords.x, previousCoords.y).setFillStyle(0x000000);
      const currentX = a;
      const currentY = b;
      this.getTile(currentX, currentY).setFillStyle(0xFFFFFF);
      const range = this.getTilesInRange({ x: currentX, y: currentY }, 2);
      const weaponRange = this.getTilesInRange({ x: currentX, y: currentY }, 1, range);
      for (let i of weaponRange) {
        (this.children.getByName(i.x + '-' + i.y) as GameObjects.Rectangle).setFillStyle(0xFF0000);
      }
      const { x, y } = gridToPixels(a, b);
      byleth.x = x;
      byleth.y = y;
      previousCoords = { x: a, y: b };
     });
  }

  getTile(x: number, y: number) {
    return this.children.getByName(x + '-' + y) as Phaser.GameObjects.Rectangle;
  }

  getTilesInRange(tile: Coords, range: number, existingTiles?: Coords[]) {
    let tiles = existingTiles || [tile];

    for (let i = 0; i < range; i++) {
      tiles = tiles.map(getNearby).flat();
    }

    const uniqueTiles = [...new Map(tiles.map(v => [v.x + "-" + v.y, v])).values()];

    return uniqueTiles;
  }
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
