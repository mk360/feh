/**
 * TODO:
 * start implementing battle preview requests
 */

import { GameObjects, Time } from 'phaser';
import socket from "../../default-socket";
import parseServerResponse from '../../parse-server-response';
import Pathfinder from '../classes/path-finder';
import Debugger from '../debug/debug';
import ActionsTray from '../objects/actions-tray';
import AssistPreview from '../objects/assist-preview';
import Button from '../objects/button';
import CombatForecast from '../objects/combat-forecast';
import Footer from '../objects/footer';
import Hero from '../objects/hero';
import InteractionIndicator from '../objects/interaction-indicator';
import UnitInfosBanner from '../objects/unit-infos-banner';
import { getTileCoordinates, gridToPixels, squareSize } from '../utils/grid-functions';
import { renderText } from '../utils/text-renderer';
import getEdges from '../utils/get-edges';

function createHeroQuoter(scene: MainScene) {
  let previousQuote = "";

  return (hero: Hero) => {
    const internalHero = hero.getInternalHero();
    const n = scene.rng.integerInRange(1, 3);
    if (previousQuote) scene.sound.stopByKey(previousQuote);
    const heroName = internalHero.Name[0].value;
    const heroSprite = heroName + " quotes";
    scene.sound.playAudioSprite(heroSprite, n.toString());
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

const roomId = new URLSearchParams(location.search).get("id");

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  rng = new Phaser.Math.RandomDataGenerator();
  heroesLayer: GameObjects.Layer;
  interactionsIndicator: InteractionIndicator;
  assistPreview: AssistPreview;
  socket = socket;
  currentTurn = "";
  side = "";
  private debugger = new Debugger(this);
  private displayEnemyRange = false;
  footer: Footer;
  combatForecast: CombatForecast;
  teamIds: string[] = [];
  actionsTray: ActionsTray;
  actionBlockingLayer: GameObjects.Rectangle;
  private tilesLayer: GameObjects.Layer;
  private unitInfosBanner: UnitInfosBanner;
  private storedPath: [number, number][] = [];
  private fpsText: GameObjects.Text;
  private playHeroQuote = createHeroQuoter(this);
  private movementUI: GameObjects.Layer;
  private miscUIElements: GameObjects.Layer;
  private aoeLayer: GameObjects.Layer;
  private enemyRangeLayer: GameObjects.Layer;
  private startRosary: GameObjects.Image;
  private endRosary: GameObjects.Image;
  private background: GameObjects.Image;
  private movementIndicator: GameObjects.Image;
  private actionIndicator: GameObjects.Image;
  private pathfinder = new Pathfinder();
  private doubleClick = createDoubleTapHandler();

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

  clearTiles() {
    for (let tile of this.tilesLayer.getChildren() as GameObjects.Rectangle[]) {
      tile.disableInteractive();
      tile.setAlpha(0);
    }
    this.heroesLayer.getChildren().forEach((child: Hero) => {
      child.effectivenessImage.iconsList = [];
      child.setInteractive(undefined, undefined, false);
    });
  }

  clearMovementLayer() {
    const ui = this.movementUI.getChildren().filter((child) => !([this.startRosary, this.movementIndicator, this.actionIndicator] as GameObjects.GameObject[]).includes(child));
    while (ui.length) ui.pop().destroy();
    this.actionIndicator.setVisible(false);
  }

  enableDragging(hero: Hero) {
    if (!hero.listeners("drag").length) {
      hero.on("drag", (_, dragX: number, dragY: number) => {
        hero.x = dragX;
        hero.y = dragY;
      });
    }

    if (!hero.listeners("dragenter").length) {
      hero.on("dragenter", (_, target: GameObjects.Rectangle) => {
        if (target.type === "Rectangle") {
          this.movementIndicator.setVisible(true);
          this.interactionsIndicator.disable();
          const savedPosition = hero.getInternalHero().Position[0];
          const { x, y } = getTileCoordinates(target.name);
          const { x: pxX, y: pxY } = gridToPixels(x, y);
          this.aoeLayer.removeAll();

          switch (target.getData("type")) {
            case "target":
              if (x !== savedPosition.x || y !== savedPosition.y) {
                this.socket.emit("request preview battle", {
                  x,
                  y,
                  roomId,
                  unit: hero.name,
                  position: hero.temporaryPosition,
                  path: this.storedPath.map(([x, y]) => ({
                    x,
                    y
                  }))
                });
                this.actionIndicator.setFrame("attack-indicator").setVisible(true);
                this.actionIndicator.setX(pxX).setY(pxY);
              }
              break;
            case "movement":
              hero.temporaryPosition = { x, y };
              this.combatForecast.setVisible(false);
              this.assistPreview.setVisible(false);
              let path = this.pathfinder.findPath(savedPosition, { x, y });
              if (!path.length) path = [[hero.temporaryPosition.x, hero.temporaryPosition.y]];
              this.storedPath = path;
              const pathCopy = [...path];
              this.drawPath(pathCopy);
              this.endRosary.setVisible(true).setX(pxX).setY(pxY);
              this.movementIndicator.setX(pxX).setY(pxY);
              this.movementIndicator.setFrame("movement-indicator");
              this.actionIndicator.setVisible(false);
              this.sound.playAudioSprite("sfx", "hover");

              break;
            case "warp":
              this.actionIndicator.setX(pxX).setY(pxY);
              this.combatForecast.setVisible(false);
              this.assistPreview.setVisible(false);
              this.actionIndicator.setFrame("movement-indicator").setVisible(true);
              this.sound.playAudioSprite("sfx", "hover");
              break;
            case "assist":
              if (x !== savedPosition.x || y !== savedPosition.y) {
                this.actionIndicator.setX(pxX).setY(pxY);
                this.combatForecast.setVisible(false);
                this.actionIndicator.setFrame("assist-indicator").setVisible(true);
                this.sound.playAudioSprite("sfx", "hover");
                this.socket.emit("request preview assist", {
                  source: hero.name,
                  roomId,
                  sourceCoordinates: hero.temporaryPosition,
                  targetCoordinates: { x, y }
                });
              }
              break;
          }
        }
      });
    }

    if (!hero.listeners("dragstart").length) {
      hero.on("dragstart", () => {
        this.startRosary.setVisible(true).setX(hero.x).setY(hero.y);
        this.movementIndicator.setVisible(true).setX(hero.x).setY(hero.y);
        hero.setDepth(hero.depth + 1);
      });
    }

    if (!hero.listeners("drop").length) {
      hero.on("drop", (_, target: GameObjects.Rectangle) => {
        console.log("attached event listener to " + hero.name, hero.getInternalHero().Name[0].value)
        this.clearMovementLayer();
        this.aoeLayer.removeAll();
        hero.setDepth(hero.depth - 1);
        const gridCell = getTileCoordinates(target.name);

        this.startRosary.setVisible(false);
        this.endRosary.setVisible(false);
        this.movementIndicator.setVisible(false);
        const tileType = target.getData("type");

        switch (tileType) {
          case "assist": {
            this.socket.emit("request confirm assist", {
              source: hero.name,
              roomId,
              targetCoordinates: gridCell,
              sourceCoordinates: hero.temporaryPosition
            });
            break;
          }
          case "target": {
            this.socket.emit("request confirm combat", {
              unitId: hero.name,
              roomId,
              attackerCoordinates: hero.temporaryPosition,
              ...gridCell,
              path: this.storedPath.map(([x, y]) => ({
                x,
                y
              }))
            });
          }
            break;
          default: {
            this.socket.emit("request confirm movement", {
              unitId: hero.name,

              roomId,
              ...gridCell,
            });
          }
        }

        this.socket.sendBuffer = [];
        this.storedPath = [];
      });
    }
    // todo: find a better way to ensure event unicity and consistency

    hero.enableMovementIndicator();

    this.input.setDraggable([hero], true);
  }

  changeTurns() {
    this.heroesLayer.getChildren().forEach((child: Hero) => {
      this.toggleHeroState(child);
    });
  }

  disableDragging(hero: Hero) {
    this.input.setDraggable([hero], false);
    hero.off("drag");
    hero.off("dragstart");
    hero.off("dragenter");
    hero.off("drop");
    hero.disableMovementIndicator();
  }

  create() {
    this.socket.emit("loading-complete", { roomId });
    this.socket.on("allow-control", ({ ids, id, currentSide }) => {
      this.side = id;
      this.currentTurn = currentSide;
      this.teamIds = ids;
      this.sound.pauseOnBlur = false;
      const header = this.add.image(0, 0, "marginals", "header").setOrigin(0);
      const entities = this.game.registry.list.world;
      this.unitInfosBanner = new UnitInfosBanner(this, id, header.getBottomCenter().y).setVisible(false);
      this.combatForecast = new CombatForecast(this).setVisible(false);
      const ornateBanner = this.add.image(this.game.canvas.width / 2, header.getBottomCenter().y, "banner").setScale(0.6).setOrigin(0.5, 0);
      this.background = this.add.image(0, ornateBanner.getBottomCenter().y, "map").setOrigin(0).setInteractive();
      this.actionsTray = this.add.existing(new ActionsTray(this, 0, this.background.getBottomCenter().y));
      const endTurn = new Button(this, "End Turn");
      this.actionsTray.addAction(endTurn, () => {
        this.socket.emit("request end turn", { roomId });
      });
      const enemyRange = new Button(this, "Enemy Range");
      enemyRange.label.setFontSize(16);
      this.actionsTray.addAction(enemyRange, () => {
        this.displayEnemyRange = !this.displayEnemyRange;
        this.socket.emit("request enemy range", {
          roomId,
          state: this.displayEnemyRange
        });
      });

      const actionsTrayBounds = this.actionsTray.getBounds();
      this.actionBlockingLayer = new GameObjects.Rectangle(this, this.actionsTray.x, this.actionsTray.y, this.game.canvas.width, actionsTrayBounds.height, 0, 1).setOrigin(0);
      this.add.existing(this.actionBlockingLayer);
      this.footer = new Footer(this, 0, this.actionsTray.getBounds().bottom, 1);
      this.add.existing(this.footer);
      this.interactionsIndicator = new InteractionIndicator(this, 0, 0).setVisible(false);
      this.tilesLayer = this.add.layer();
      this.movementUI = this.add.layer();
      this.heroesLayer = this.add.layer();
      this.miscUIElements = this.add.layer();
      this.aoeLayer = this.add.layer();
      this.enemyRangeLayer = this.add.layer();
      this.miscUIElements.add(this.interactionsIndicator);
      this.startRosary = new GameObjects.Image(this, 0, 0, "path", "rosary").setVisible(false).setDisplaySize(squareSize, squareSize);
      this.endRosary = new GameObjects.Image(this, 0, 0, "path", "rosary").setVisible(false).setDisplaySize(squareSize, squareSize);
      this.movementIndicator = new GameObjects.Image(this, 0, 0, "movement-indicators", "movement-indicator").setVisible(false);
      this.actionIndicator = new GameObjects.Image(this, 0, 0, "movement-indicators", "movement-indicator").setVisible(false);
      this.movementUI.add(this.movementIndicator);
      this.movementUI.add(this.actionIndicator);
      this.movementUI.add(this.endRosary);
      this.movementUI.add(this.startRosary);

      for (let i = 1; i < 7; i++) {
        for (let j = 1; j < 9; j++) {
          const px = gridToPixels(i, j);
          const rec = new GameObjects.Rectangle(this, px.x, px.y, squareSize, squareSize, 0, 0);
          rec.setName((i * 10 + j).toString());
          this.tilesLayer.add(rec);
        }
      }

      this.add.existing(this.unitInfosBanner);
      this.add.existing(this.combatForecast);
      this.assistPreview = new AssistPreview(this, header.getBottomCenter().y).setVisible(false);

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
            unitId: hero.name,
            roomId,
          });
          this.socket.sendBuffer = [];
          if (!hero.getInternalHero().FinishedAction && hero.getInternalHero().Side[0].value === this.side && this.side === this.currentTurn) {
            const isDoubleTap = this.doubleClick(this.time.now);
            if (isDoubleTap) {
              const internal = hero.getInternalHero();
              this.socket.emit("request freeze unit", {
                unitId: hero.name,
                ...internal.Position[0],
                roomId,
              });
            } else {
              this.playHeroQuote(hero);
            }
          }
        });

        this.toggleHeroState(hero);
      }

      this.background.on("pointerdown", () => {
        this.sound.playAudioSprite("sfx", "cancel");
        this.aoeLayer.removeAll();
        for (let child of this.tilesLayer.getChildren() as GameObjects.Rectangle[]) {
          child.disableInteractive();
          child.setAlpha(0);
        }

        if (this.side === this.currentTurn) {
          this.movementIndicator.setVisible(false);
          this.heroesLayer.getChildren().forEach((child: Hero) => {
            this.toggleHeroState(child);
          });
        }
        this.heroesLayer.getChildren().forEach((child: Hero) => {
          child.effectivenessImage.iconsList = [];
          child.setInteractive(undefined, undefined, false);
        });

        this.unitInfosBanner.closeTextbox();
      });

      const layer = this.add.rectangle(0, 0, +this.game.config.width, +this.game.config.height, 0x0f0540, 1).setOrigin(0);
      const startGameButton = new GameObjects.Rectangle(this, layer.getCenter().x, layer.getCenter().y - 50, 240, 120, 0x0066ae).setInteractive();
      const startGameText = renderText({
        scene: this,
        x: startGameButton.getCenter().x,
        y: startGameButton.getCenter().y,
        content: "Start Game",
        style: {
          fontSize: 26
        }
      }).setOrigin(0.5);
      startGameButton.on("pointerdown", () => {
        layer.destroy();
        startGameText.destroy();
        startGameButton.destroy();
        this.socket.emit("ready", { roomId });
      });
      this.add.existing(startGameButton);
      this.add.existing(startGameText);
    });

    this.socket.on("update-entities", (dict) => {
      for (let heroId in dict) {
        const hero = this.heroesLayer.getByName(heroId) as Hero;
        hero.updateHero(dict[heroId]);
      }
    });

    this.socket.on("response enemy range", (enemyRange: number[]) => {
      this.enemyRangeLayer.removeAll();
      const edges = getEdges(enemyRange);
      console.log(edges);
      edges[0].sides
      for (let item of enemyRange) {
        const { x, y } = getTileCoordinates(item);
        const { x: pxX, y: pxY } = gridToPixels(x, y);
        const rec = new GameObjects.Rectangle(this, pxX, pxY, squareSize, squareSize, 0x0, 0.4);

        this.enemyRangeLayer.add(rec);
      }
    });

    this.socket.on("response unit map stats", ({ unitId, ...stats }) => {
      const hero = this.heroesLayer.getByName(unitId) as Hero;
      this.unitInfosBanner.setVisible(true).setHero(hero, stats);
    });

    this.socket.on("response preview assist", ({ assisted, assisting, assist }) => {
      const assistingObject = this.heroesLayer.getByName(assisting.id) as Hero;
      const assistedObject = this.heroesLayer.getByName(assisted.id) as Hero;
      this.assistPreview.updateSides({
        assisting: {
          object: assistingObject,
          previousHP: assisting.previousHP,
          expectedHP: assisting.expectedHP,
        },
        assisted: {
          object: assistedObject,
          previousHP: assisted.previousHP,
          expectedHP: assisted.expectedHP,
        },
        assist
      });
    });

    this.socket.on("response preview movement", ({ movement = [], assistArray = [], attack = [], warpTiles = [], targetableTiles = [], effectiveness, unitId }) => {
      for (let child of this.tilesLayer.getChildren() as GameObjects.Rectangle[]) {
        child.disableInteractive();
        child.setAlpha(0);
      }

      const targetHero = this.heroesLayer.getByName(unitId) as Hero;
      const isAlly = targetHero.getInternalHero().Side[0].value === this.side;
      const isActive = !targetHero.getInternalHero().FinishedAction;
      const shouldInteract = isActive && isAlly;

      this.pathfinder.reset();

      for (let tile of movement) {
        const x = Math.floor(tile / 10);
        const y = tile - Math.floor(tile / 10) * 10;
        const rec = this.tilesLayer.getByName(tile.toString()) as GameObjects.Rectangle;
        this.pathfinder.setWalkable(x, y);
        rec.setFillStyle(0x0000FF).setAlpha(0.5);
        rec.setData("type", "movement");
        rec.setInteractive(undefined, undefined, shouldInteract);
      }

      for (let tile of attack) {
        const rec = this.tilesLayer.getByName(tile.toString()) as GameObjects.Rectangle;
        rec.setFillStyle(0xFF0000).setAlpha(0.3);
      }

      for (let tile of targetableTiles) {
        const rec = this.tilesLayer.getByName(tile.toString()) as GameObjects.Rectangle;
        rec.setFillStyle(0xFF0000).setAlpha(0.7);
        rec.setInteractive(undefined, undefined, shouldInteract);
        rec.setData("type", "target");
      }

      for (let tile of warpTiles) {
        const rec = this.tilesLayer.getByName(tile.toString()) as GameObjects.Rectangle;
        rec.setFillStyle(0x00FFFF).setAlpha(0.5);
        rec.setInteractive(undefined, undefined, shouldInteract);
        rec.setData("type", "warp");
      }

      for (let tile of assistArray) {
        const rec = this.tilesLayer.getByName(tile.toString()) as GameObjects.Rectangle;
        rec.setFillStyle(0x00FF00).setAlpha(0.5);
        rec.setData("type", "assist");
        rec.setInteractive(undefined, undefined, shouldInteract);
      }

      for (let character of this.heroesLayer.getAll() as Hero[]) {
        character.effectivenessImage.iconsList = [];
      }

      for (let character in effectiveness) {
        const heroObject = this.heroesLayer.getByName(character) as Hero;
        heroObject.effectivenessImage.iconsList = [];
        const [heroIsEffective, enemyIsEffective] = effectiveness[character];
        const isAlly = this.side === heroObject.getInternalHero().Side[0].value;

        if (heroIsEffective) {
          if (isAlly) {
            heroObject.effectivenessImage.iconsList.push("enemy-effective");
          } else {
            heroObject.effectivenessImage.iconsList.push("effective-against-enemy");
          }
        }

        if (enemyIsEffective) {
          if (isAlly) {
            heroObject.effectivenessImage.iconsList.push("effective-against-enemy");
          } else {
            heroObject.effectivenessImage.iconsList.push("enemy-effective");
          }
        }

        heroObject.toggleEffectivenessImages();
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
      this.debugger.logMessage(args);
      const responseAnimations = parseServerResponse(this, args);
      for (let eventLine of responseAnimations) {
        await Promise.all(eventLine.map(promiseAnimation));
      }

      this.socket.emit("request update", { roomId });
      // after each action, emit the "request enemy range"
    });

    this.socket.on("response confirm movement", (response: { unitId: string, x: number, y: number }) => {
      const object = this.heroesLayer.getByName(response.unitId) as Hero;
      const pxCell = gridToPixels(response.x, response.y);
      this.tweens.add({
        targets: [object],
        x: pxCell.x,
        y: pxCell.y,
        duration: 100,
      });
      this.sound.play("confirm");
      this.heroesLayer.getChildren().forEach((child: Hero) => {
        child.effectivenessImage.iconsList = [];
      });
      this.clearMovementLayer();
    });

    this.socket.on("response preview assist", (preview) => {
      preview.assisting.id = this.heroesLayer.getByName(preview.assisting.id) as Hero;
      preview.assisted.id = this.heroesLayer.getByName(preview.assisted.id) as Hero;
      this.assistPreview.updateSides(preview).setVisible(true);
    });

    this.socket.on("response preview battle", (preview) => {
      const { attacker: previewAttacker, defender: previewDefender, attackerTile } = preview;
      const attacker = this.heroesLayer.getByName(previewAttacker.id) as Hero;
      const defender = this.heroesLayer.getByName(previewDefender.id) as Hero;
      const { x, y } = gridToPixels(attackerTile.x, attackerTile.y);
      const storedPath = [...this.storedPath];
      const attackerTileIndex = storedPath.findIndex((tile) => {
        return tile[0] === attackerTile.x && tile[1] === attackerTile.y;
      });
      const pathStoppingAtAttackerTile = storedPath.slice(0, attackerTileIndex + 1);
      this.drawPath(pathStoppingAtAttackerTile);
      this.movementIndicator.setX(x).setY(y);
      this.combatForecast.setForecastData({
        attacker: {
          entity: attacker,
          damage: previewAttacker.damagePerTurn,
          turns: previewAttacker.turns,
          startHP: previewAttacker.previousHP,
          effectiveness: previewAttacker.effectiveness,
          remainingHP: previewAttacker.newHP,
          statMods: previewAttacker.combatBuffs,
          damageBeforeCombat: previewAttacker.beforeCombat,
        },
        defender: {
          entity: defender,
          damage: previewDefender.damagePerTurn,
          turns: previewDefender.turns,
          startHP: previewDefender.previousHP,
          effectiveness: previewDefender.effectiveness,
          remainingHP: previewDefender.newHP,
          statMods: previewDefender.combatBuffs,
          damageBeforeCombat: 0,
        }
      });
      this.combatForecast.setVisible(true);
      const tween = this.interactionsIndicator.setVisible(true).hover(defender).tween();
      if (preview.aoeTargets.length) {
        for (let target of preview.aoeTargets) {
          const object = this.heroesLayer.getByName(target) as Hero;
          const spriteCoords = object.getAbsoluteCoordinates();
          const aoeSpecialIcon = new GameObjects.Image(this, spriteCoords.x, spriteCoords.y, "skills-ui", "special-icon").setScale(0.65);
          this.aoeLayer.add(aoeSpecialIcon);
        }
      }

      tween.play();
    });

    this.socket.on("update entity", ({ unitId, type, ...data }: HeroUpdatePayload) => {
      const hero = this.heroesLayer.getByName(unitId) as Hero;
      const internalHero = hero.getInternalHero();
      internalHero[type] = Array.isArray(data) ? data : [data];
    });

    // const 
    // this.assistPreview
    // this.startBackgroundMusic(0.13);
  }


  update(_, delta) {
    timer += delta;
    const ONE_SECOND = 1000;
    if (timer >= 0.8 * ONE_SECOND) {
      timer = 0;
      if (this.heroesLayer) {
        this.heroesLayer.getChildren().forEach((hero: Hero) => {
          hero.toggleStatuses();
          hero.toggleEffectivenessImages();
        });
      }
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
    const { x: gridX, y: gridY } = entity.components.Position[0];
    const { x, y } = gridToPixels(gridX, gridY);
    const heroObject = new Hero(this, x, y, entity);
    heroObject.setSize(squareSize, squareSize);
    this.heroesLayer.add(heroObject);
    return heroObject;
  }

  /**
   * Controls whether a hero can be dragged or not,
   * depending on its side and its current state.
  */
  toggleHeroState(hero: Hero) {
    const { Side: [{ value }], FinishedAction } = hero.getInternalHero();
    if (this.currentTurn === this.side && value === this.side) {
      if (FinishedAction) {
        this.disableDragging(hero);
        const matrix = hero.sprite.postFX.addColorMatrix();
        matrix.blackWhite(true);
      } else {
        this.enableDragging(hero);
      }
    } else {
      hero.sprite.clearFX();
      this.disableDragging(hero);
    }
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
