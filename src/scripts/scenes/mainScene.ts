/**
 * TODO:
 * start implementing battle preview requests
 * implement bonuses
 */

import { GameObjects, Time } from 'phaser';
import Hero from '../objects/hero';
import UnitInfosBanner from '../objects/unit-infos-banner';
import socket from "../../default-socket";
import InteractionIndicator from '../objects/interaction-indicator';
import Pathfinder from '../classes/path-finder';
import { renderText } from '../utils/text-renderer';
import CombatForecast from '../objects/combat-forecast';
import Footer from '../objects/footer';
import parseServerResponse from '../../parse-server-response';
import { gridToPixels, squareSize } from '../utils/grid-functions';
import { pixelsToGrid } from '../utils/grid-functions';
import ActionsTray from '../objects/actions-tray';
import Button from '../objects/button';

function createHeroQuoter(scene: MainScene) {
  let previousQuote = "";

  return (hero: Hero) => {
    const internalHero = hero.getInternalHero();
    const n = scene.rng.integerInRange(1, 3);
    if (previousQuote) scene.sound.stopByKey(previousQuote);
    const heroName = internalHero.Name[0].value;
    const heroSprite = heroName + " quotes";
    scene.sound.playAudioSprite(heroSprite, n.toString(), { volume: 0.2 });
    previousQuote = heroSprite;
  };
}


function createDoubleTapHandler() {
  const dblClickMargin = 300;
  let previousTimeStamp = 0;
  return (timeStamp: number) => {
    const isDoubleTap = timeStamp - previousTimeStamp <= dblClickMargin;
    previousTimeStamp = timeStamp;
    return isDoubleTap;
  };
}

interface HeroUpdatePayload {
  unitId: string;
  type: string;
  [k: string]: any
}

let timer = 0;

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  rng = new Phaser.Math.RandomDataGenerator();
  heroesLayer: GameObjects.Layer;
  socket = socket;
  private tilesLayer: GameObjects.Layer;
  private unitInfosBanner: UnitInfosBanner;
  private side: string;
  private fpsText: GameObjects.Text;
  private interactionsIndicator: InteractionIndicator;
  private combatForecast: CombatForecast;
  private playHeroQuote = createHeroQuoter(this);
  private movementUI: GameObjects.Layer;
  private miscUIElements: GameObjects.Layer;
  private startRosary: GameObjects.Image;
  private endRosary: GameObjects.Image;
  private background: GameObjects.Image;
  private movementIndicator: GameObjects.Image;
  private pathfinder = new Pathfinder();
  private doubleClick = createDoubleTapHandler();
  private footer: Footer;
  private actionsTray: ActionsTray;

  drawPath(path: [number, number][]) {
    this.clearMovementLayer();

    const [start, ...remainder] = path;
    if (remainder.length) {
      const startCoordinates = gridToPixels(start[0], start[1]);
      this.startRosary.x = startCoordinates.x;
      this.startRosary.y = startCoordinates.y;
      this.startRosary.setVisible(true);
    }

    if (path[1]) {
      const rosaryDirection = getTilesDirection(start, path[1]);
      const verticalAngle = rosaryDirection === "down" ? 0 : rosaryDirection === "up" ? 180 : null;
      const horizontalAngle = rosaryDirection === "left" ? 90 : rosaryDirection === "right" ? -90 : null;
      const finalAngle = verticalAngle ?? horizontalAngle;
      this.startRosary.setAngle(finalAngle);
      this.startRosary.setFrame("rosary-arrow");
    } else {
      this.startRosary.setFrame("rosary");
    }

    const end = path[path.length - 1];

    for (let i = 1; i < path.length - 1; i++) {
      const tile = path[i];
      const previousTile = i === 0 ? start : path[i - 1];
      const nextTile = i === path.length - 1 ? end : path[i + 1];
      const fromPreviousTile = getTilesDirection(previousTile, tile);
      const toNextTile = getTilesDirection(tile, nextTile);

      const gridCoordinates = gridToPixels(tile[0], tile[1]);
      if (fromPreviousTile === toNextTile) {
        const straightPath = new GameObjects.Image(this, gridCoordinates.x, gridCoordinates.y, "path", "vertical-fixed").setDisplaySize(squareSize, squareSize);
        if (["right", "left"].includes(fromPreviousTile)) {
          straightPath.setRotation(Math.PI / 2);
        }
        this.movementUI.add(straightPath, true);
      } else {
        const elbow = new GameObjects.Image(this, gridCoordinates.x, gridCoordinates.y, "path", `path-${fromPreviousTile}-${toNextTile}`).setDisplaySize(squareSize, squareSize);
        this.movementUI.add(elbow, true);
      }
    }

    if (path.length > 1) {
      const endArrowDirection = getTilesDirection(path[path.length - 2], end);
      const endPixels = gridToPixels(end[0], end[1]);
      const endArrow = new GameObjects.Image(this, endPixels.x, endPixels.y, "path", "end-arrow-fixed").setDisplaySize(squareSize, squareSize);
      const verticalAngle = endArrowDirection === "down" ? 90 : endArrowDirection === "up" ? -90 : null;
      const horizontalAngle = endArrowDirection === "left" ? 180 : endArrowDirection === "right" ? 0 : null;
      const finalAngle = verticalAngle ?? horizontalAngle;
      endArrow.setAngle(finalAngle);
      this.movementUI.add(endArrow);
    }
  }

  clearMovementLayer() {
    const ui = this.movementUI.getChildren().filter((child) => !([this.startRosary, this.movementIndicator] as GameObjects.GameObject[]).includes(child));
    while (ui.length) ui.pop().destroy();
  }

  create() {
    this.sound.pauseOnBlur = false;
    this.add.image(0, 0, "marginals", "header").setOrigin(0);
    const entities = this.game.registry.list.world;
    this.unitInfosBanner = new UnitInfosBanner(this).setVisible(false);
    this.combatForecast = new CombatForecast(this).setVisible(false);
    this.background = this.add.image(0, 250, "map").setOrigin(0).setInteractive();
    const toolbar = this.add.container(0, this.background.getBottomCenter().y);
    this.actionsTray = this.add.existing(new ActionsTray(this, 0, this.background.getBottomCenter().y));
    // const button = new Button(this, "test");
    // this.actionsTray.addAction(button);
    this.footer = new Footer(this, 0, this.actionsTray.getBounds().bottom, 1);
    this.add.existing(this.footer);
    this.interactionsIndicator = new InteractionIndicator(this, 0, 0).setVisible(false);
    this.tilesLayer = this.add.layer();
    this.movementUI = this.add.layer();
    this.heroesLayer = this.add.layer();
    this.miscUIElements = this.add.layer();
    this.miscUIElements.add(this.interactionsIndicator);
    this.startRosary = new GameObjects.Image(this, 0, 0, "path", "rosary").setVisible(false).setDisplaySize(95, 95);
    this.endRosary = new GameObjects.Image(this, 0, 0, "path", "rosary").setVisible(false).setDisplaySize(95, 95);
    this.movementIndicator = new GameObjects.Image(this, 0, 0, "movement-indicators", "movement-indicator").setVisible(false);
    this.movementUI.add(this.movementIndicator);
    this.movementUI.add(this.endRosary);
    this.movementUI.add(this.startRosary);

    this.add.existing(this.unitInfosBanner);
    this.add.existing(this.combatForecast);

    for (let entityId in entities.heroes) {
      const entity = entities.heroes[entityId];
      const hero = this.addHero(entity).setInteractive();
      hero.setName(entityId);
      hero.on("pointerdown", () => {
        this.sound.playAudioSprite("sfx", "tap");
        this.heroesLayer.getChildren().forEach((child: Hero) => {
          child.disableMovementIndicator();
        });
        this.socket.emit("request preview movement", {
          unitId: hero.name
        });
        this.socket.sendBuffer = [];
        const isDoubleTap = this.doubleClick(this.time.now);
        if (isDoubleTap) {
          const internal = hero.getInternalHero();
          this.socket.emit("request freeze unit", {
            unitId: hero.name,
            ...internal.Position[0]
          });
        } else {
          this.playHeroQuote(hero);
        }
      });

      hero.on("drag", (_, dragX: number, dragY: number) => {
        hero.x = dragX;
        hero.y = dragY;
      });

      hero.on("dragenter", (_, target) => {
        if (target.type === "Rectangle") {
          this.interactionsIndicator.disable();
          const gridCell = pixelsToGrid(target.x, target.y);
          const savedPosition = hero.getInternalHero().Position[0];
          const { x, y } = gridToPixels(gridCell.x, gridCell.y);

          switch (target.name) {
            case "attack":
              this.socket.emit("request preview battle", {
                x: gridCell.x,
                y: gridCell.y,
                unit: hero.name,
                position: hero.temporaryPosition
              });

              this.movementIndicator.setFrame("attack-indicator");
              this.movementIndicator.setX(x).setY(y);
              break;
            case "movement":
              hero.temporaryPosition = gridCell;
              this.combatForecast.setVisible(false);
              const path = this.pathfinder.findPath(savedPosition, gridCell);
              const pathCopy = [...path];
              this.drawPath(pathCopy);
              this.movementIndicator.setX(x).setY(y);
              this.movementIndicator.setFrame("movement-indicator");
              this.sound.playAudioSprite("sfx", "hover");

              break;
            case "warp":
              this.movementIndicator.setX(x).setY(y);
              this.combatForecast.setVisible(false);
              this.movementIndicator.setFrame("movement-indicator");
              this.sound.playAudioSprite("sfx", "hover");
              break;
            case "assist":
              this.movementIndicator.setX(x).setY(y);
              this.combatForecast.setVisible(false);
              this.movementIndicator.setFrame("assist-indicator");
              this.sound.playAudioSprite("sfx", "hover");
              break;
          }
        }
      });

      hero.on("dragstart", () => {
        this.startRosary.setVisible(true).setX(hero.x).setY(hero.y);
        this.movementIndicator.setVisible(true).setX(hero.x).setY(hero.y);
        hero.setDepth(hero.depth + 1);
      });

      hero.on("drop", (_, target) => {
        this.clearMovementLayer();
        hero.setDepth(hero.depth - 1);
        const gridCell = pixelsToGrid(hero.x, hero.y);
        this.startRosary.setVisible(false);
        this.endRosary.setVisible(false);
        this.movementIndicator.setVisible(false);
        if (target.name !== "attack") {
          this.socket.emit("request confirm movement", {
            unitId: hero.name,
            ...gridCell,
          });
        } else {
          this.socket.emit("request confirm combat", {
            unitId: hero.name,
            ...gridCell
          });
        }
        this.socket.sendBuffer = [];
      });

      hero.on("dragend", (target, _, a) => {
        // this.clearMovementLayer();
        // hero.setDepth(hero.depth - 1);
        // const gridCell = pixelsToGrid(hero.x, hero.y);
        // this.startRosary.setVisible(false);
        // this.endRosary.setVisible(false);
        // this.movementIndicator.setVisible(false);
        // console.log(target, target.name, a);
        // if (target.name !== "attack") {
        //   this.socket.emit("request confirm movement", {
        //     unitId: hero.name,
        //     ...gridCell,
        //   });
        // } else {
        //   this.socket.emit("request confirm battle", {
        //     unitId: hero.name,
        //     ...gridCell
        //   });
        // }
        // this.socket.sendBuffer = [];
      });

      this.input.setDraggable([hero], true);
    }

    this.socket.on("update-entity", ({ unitId, data }) => {
      const hero = this.heroesLayer.getByName(unitId) as Hero;
      const newData = Object.assign(hero.getInternalHero(), data);
      hero.data.set("hero", newData);
    });

    this.socket.on("response unit map stats", ({ unitId, ...stats }) => {
      const hero = this.heroesLayer.getByName(unitId) as Hero;
      this.unitInfosBanner.setVisible(true).setHero(hero, stats);
    });

    this.socket.on("response preview movement", ({ movement = [], assistArray = [], attack = [], warpTiles = [], targetableTiles = [], effectiveness }) => {
      const childrenTiles = this.tilesLayer.getChildren();
      while (childrenTiles.length) childrenTiles.pop().destroy();
      this.pathfinder.reset();

      for (let tile of movement) {
        const x = Math.floor(tile / 10);
        const y = tile - Math.floor(tile / 10) * 10;
        const pxPosition = gridToPixels(x, y);
        this.pathfinder.setWalkable(x, y);
        const rec = new GameObjects.Rectangle(this, pxPosition.x, pxPosition.y, squareSize, squareSize, 0x0000FF, 0.5).setInteractive(undefined, undefined, true).setName("movement");
        this.tilesLayer.add(rec);
      }

      for (let tile of attack) {
        const x = Math.floor(tile / 10);
        const y = tile - Math.floor(tile / 10) * 10;
        const pxPosition = gridToPixels(x, y);
        const rec = new GameObjects.Rectangle(this, pxPosition.x, pxPosition.y, squareSize, squareSize, 0xFF0000, 0.3);
        this.tilesLayer.add(rec);
      }

      for (let tile of targetableTiles) {
        const x = Math.floor(tile / 10);
        const y = tile - Math.floor(tile / 10) * 10;
        const pxPosition = gridToPixels(x, y);
        const rec = new GameObjects.Rectangle(this, pxPosition.x, pxPosition.y, squareSize, squareSize, 0xFF0000, 0.7).setInteractive(undefined, undefined, true).setName("attack");
        this.tilesLayer.add(rec);
      }

      for (let tile of warpTiles) {
        const x = Math.floor(tile / 10);
        const y = tile - Math.floor(tile / 10) * 10;
        const pxPosition = gridToPixels(x, y);
        const rec = new GameObjects.Rectangle(this, pxPosition.x, pxPosition.y, squareSize, squareSize, 0x00FFFF, 0.5).setInteractive(undefined, undefined, true).setName("warp");
        this.tilesLayer.add(rec);
      }

      for (let tile of assistArray) {
        const x = Math.floor(tile / 10);
        const y = tile - Math.floor(tile / 10) * 10;
        const pxPosition = gridToPixels(x, y);
        const rec = new GameObjects.Rectangle(this, pxPosition.x, pxPosition.y, squareSize, squareSize, 0x00FF00, 0.5).setInteractive(undefined, undefined, true).setName("assist");
        this.tilesLayer.add(rec);
      }

      for (let character of this.heroesLayer.getAll() as Hero[]) {
        character.effectivenessImage.iconsList = [];
      }

      for (let enemy in effectiveness) {
        const enemyHero = this.heroesLayer.getByName(enemy) as Hero;
        enemyHero.effectivenessImage.iconsList = [];
        const [heroIsEffective, enemyIsEffective] = effectiveness[enemy];

        if (heroIsEffective) {
          enemyHero.effectivenessImage.iconsList.push("effective-against-enemy");
        }

        if (enemyIsEffective) {
          enemyHero.effectivenessImage.iconsList.push("enemy-effective");
        }

        enemyHero.toggleEffectivenessImages();
      }
    });

    function promiseAnimation(timeline: Time.Timeline) {
      return new Promise((resolve) => {
        timeline.on("complete", () => {
          resolve(null);
        });
        timeline.play();
      });
    }

    this.socket.on("response", async (args) => {
      const x = parseServerResponse(this, args);
      for (let eventLine of x) {
        await Promise.all(eventLine.map(promiseAnimation));
      }
    });

    this.socket.on("response confirm movement", (response: { unitId: string, x: number, y: number, valid: boolean }) => {
      const object = this.heroesLayer.getByName(response.unitId) as Hero;
      const pxCell = gridToPixels(response.x, response.y);
      this.tweens.add({
        targets: [object],
        x: pxCell.x,
        y: pxCell.y,
        duration: 100,
      });
      if (response.valid) {
        this.sound.play("confirm");
        const tiles = this.tilesLayer.getChildren();
        while (tiles.length) tiles.pop().destroy();
        this.heroesLayer.getChildren().forEach((child: Hero) => {
          child.effectivenessImage.iconsList = [];
        });
        this.clearMovementLayer();
      }
    });

    this.socket.on("response preview battle", (preview) => {
      const { attacker: previewAttacker, defender: previewDefender } = preview;
      const attacker = this.heroesLayer.getByName(previewAttacker.id) as Hero;
      const defender = this.heroesLayer.getByName(previewDefender.id) as Hero;
      this.combatForecast.setForecastData({
        attacker: {
          entity: attacker,
          damage: previewAttacker.damagePerTurn,
          turns: previewAttacker.turns,
          startHP: previewAttacker.previousHP,
          effectiveness: previewAttacker.effectiveness,
          remainingHP: previewAttacker.newHP,
          statMods: previewAttacker.combatBuffs
        },
        defender: {
          entity: defender,
          damage: previewDefender.damagePerTurn,
          turns: previewDefender.turns,
          startHP: previewDefender.previousHP,
          effectiveness: false,
          remainingHP: previewDefender.newHP,
          statMods: previewDefender.combatBuffs
        }
      });
      this.combatForecast.setVisible(true);
      const tween = this.interactionsIndicator.setVisible(true).hover(defender).tween();

      tween.play();
    });

    this.socket.on("update entity", ({ unitId, type, ...data }: HeroUpdatePayload) => {
      const hero = this.heroesLayer.getByName(unitId) as Hero;
      const internalHero = hero.getInternalHero();
      internalHero[type] = [data];
    });

    this.background.on("pointerdown", () => {
      this.movementIndicator.setVisible(false);
      this.sound.playAudioSprite("sfx", "cancel");
      this.heroesLayer.getChildren().forEach((child: Hero) => {
        child.enableMovementIndicator();
      });
      const tiles = this.tilesLayer.getChildren();
      while (tiles.length) tiles.pop().destroy();
      this.heroesLayer.getChildren().forEach((child: Hero) => {
        child.effectivenessImage.iconsList = [];
        child.setInteractive(undefined, undefined, false);
      });
      this.unitInfosBanner.closeTextbox();
    });
    // this.startBackgroundMusic(0.13);

    const layer = this.add.rectangle(0, 0, +this.game.config.width, +this.game.config.height, 0xD8BA94, 1).setOrigin(0);
    const startGameButton = new GameObjects.Rectangle(this, layer.getCenter().x, layer.getCenter().y - 50, 240, 120, 0x00AF81).setInteractive();
    const startGameText = renderText(this, startGameButton.getCenter().x, startGameButton.getCenter().y, "Start Game", {
      fontSize: 26
    }).setOrigin(0.5);
    startGameButton.on("pointerdown", () => {
      layer.destroy();
      startGameText.destroy();
      startGameButton.destroy();
      this.socket.emit("ready");
    });
    this.add.existing(startGameButton);
    this.add.existing(startGameText);
  }

  update(_, delta) {
    timer += delta;
    const ONE_SECOND = 1000;
    if (timer >= 1.5 * ONE_SECOND) {
      timer = 0;
      this.heroesLayer.getChildren().forEach((hero: Hero) => {
        hero.toggleStatuses();
        hero.toggleEffectivenessImages();
      });
    }
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

  addHero(entity) {
    const { x: gridX, y: gridY } = entity.Position[0];
    const { x, y } = gridToPixels(gridX, gridY);
    const heroObject = new Hero(this, x, y, entity);
    heroObject.setSize(90, 90);
    this.heroesLayer.add(heroObject);
    return heroObject;
  }
}

function getTilesDirection(tile1: [number, number], tile2: [number, number]) {
  if (tile1[1] !== tile2[1]) {
    return tile1[1] < tile2[1] ? "down" : "up";
  }

  if (tile1[0] !== tile2[0]) {
    return tile1[0] < tile2[0] ? "right" : "left";
  }
};

// export default class MainScene extends Phaser.Scene {
//   heroBackground: Phaser.GameObjects.Rectangle;
//   movementAllowedTween: Phaser.Tweens.Tween;
//   combatForecast: CombatForecast;
//   interactionIndicator: InteractionIndicator;
//   interactionIndicatorTween: Tweens.Tween
//   actionsTray = new ActionsTray(this);
//   tileHighlight: GameObjects.Image;
//   updateDelta = 0;
//   timeline: Time.Timeline;
//   states: {
//     preparation: PreparationState;
//     fighting: FightingState;
//   };
//   currentState: State;

//   constructor() {
//     super({ key: 'MainScene' });
//     this.states = {
//       preparation: new PreparationState(this),
//       fighting: new FightingState(this)
//     };

//     this.currentState = this.states.preparation;
//   }

//   processAction(action: UIAction) {
//     switch (action.type) {
//       case "display-enemy-range": {
//         const { enabled } = action;
//         this.displayEnemyRange(enabled);
//         break;
//       };

//         break;
//       case "attack": {
//         const { args } = action;
//         this.runCombat(args.outcome);
//       }
//         break;
//       case "preview": {
//         const { args } = action;
//         this.unitInfosBanner.setVisible(false);
//         this.interactionIndicatorTween?.destroy();
//         const defenderCoordinates = this.getHeroCoordinates(this.getByName<Hero>(args.defender.id));
//         this.interactionIndicator.x = defenderCoordinates.x;
//         this.interactionIndicator.y = defenderCoordinates.y - 80;
//         this.interactionIndicatorTween = this.tweens.add({
//           targets: [this.interactionIndicator],
//           y: defenderCoordinates.y - 70,
//           duration: 400,
//           loop: -1,
//           yoyo: true,
//         }) as Tweens.Tween;
//         this.interactionIndicatorTween.play();
//         this.interactionIndicator.setVisible(true).setContent("attack");
//         this.combatForecast.setVisible(true).setForecastData({
//           attacker: {
//             hero: args.attacker,
//             ...args.outcome.attacker
//           },
//           defender: {
//             hero: args.defender,
//             ...args.outcome.defender
//           }
//         });
//       }
//         break;
//       case "switch": {
//         const { args } = action;
//         const { firstHero, secondHero } = args;
//         const firstHeroPx = gridToPixels(firstHero.coordinates.x, firstHero.coordinates.y);
//         const secondHeroPx = gridToPixels(secondHero.coordinates.x, secondHero.coordinates.y);
//         battle.switchHeroes(firstHero, secondHero);
//         this.add.timeline([{
//           at: 0,
//           tween: {
//             targets: this.children.getByName(firstHero.id),
//             x: secondHeroPx.x,
//             y: secondHeroPx.y,
//             duration: 75
//           }
//         }, {
//           at: 0,
//           tween: {
//             targets: this.children.getByName(secondHero.id),
//             x: firstHeroPx.x,
//             y: firstHeroPx.y,
//             duration: 75,
//           }
//         }]).play();
//         break;
//       }
//       case "start-turn": {
//         const { args } = action;
//         this.setTurn(args);
//         break;
//       };
//       case "swap-spaces": {
//         this.switchPositionsMode();
//         break;
//       }
//     }
//   }

//   createDamageText(turn: CombatOutcome["turns"][number]) {
//     const isAdvantage = turn.effective || turn.advantage === "advantage";
//     const isDisadvantage = turn.advantage === "disadvantage" && !turn.effective;
//     const damageFontSize = isDisadvantage ? 28 : isAdvantage ? 44 : 36;
//     const defenderObject = this.getByName<Hero>(turn.defender.id);
//     const coordinatesVector = this.getHeroCoordinates(defenderObject).subtract({ x: 30, y: 30 });
//     const damageText = renderDamageText({
//       scene: this,
//       x: coordinatesVector.x,
//       y: coordinatesVector.y,
//       content: turn.damage,
//       style: {
//         fontSize: damageFontSize,
//       }
//     }).setDepth(4);

//     return damageText;
//   }

//   createKOTween(hero: Hero) {
//     return this.tweens.create({
//       targets: hero.image,
//       alpha: 0,
//       duration: 300,
//       onStart: () => {
//         this.sound.play("ko");
//       },
//       onComplete: () => {
//         this.children.remove(hero);
//         battle.killHero(hero.getInternalHero(), hero.team);
//         hero.destroy();
//         hero = null;
//       }
//     }) as Tweens.Tween;
//   }

//   displayEnemyRange(enabled: boolean) {
//     const otherTeam = this.turn === "team1" ? "team2" : "team1";
//     const enemyRangeTiles = battle.getEnemyRange(otherTeam);
//     if (enabled) {
//       this.enemyRangeCoords = enemyRangeTiles;
//       for (let tile of enemyRangeTiles) {
//         const { x, y } = gridToPixels(+tile[0], +tile[2]);
//         const enemyRangeTile = new GameObjects.Rectangle(this, x, y, squareSize, squareSize, 0x540000, 0.6);
//         this.enemyRangeLayer.add(enemyRangeTile);
//       }
//     } else {
//       this.enemyRangeLayer.removeAll();
//     }
//   }
