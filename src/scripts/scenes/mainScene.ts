import { GameObjects, Time, Tweens } from 'phaser';
import Hero from '../objects/hero';
import DEBUG_ENTITIES from '../../debug';
import UnitInfosBanner from '../objects/unit-infos-banner';
import { renderDamageText, renderText } from '../utils/text-renderer';
// import CombatForecast from '../objects/combat-forecast';
// import Coords from '../../interfaces/coords';
// import battle from '../classes/battle';
// import HeroData from "feh-battles/dec/hero";
// import InteractionIndicator from '../objects/interaction-indicator';
// import Team from '../../types/team';
// import stringifyTile from '../utils/stringify-tile';
// import toCoords from '../utils/to-coords';
// import UIAction from '../../interfaces/ui-action';
// import { CombatOutcome } from 'feh-battles/dec/combat';
// import ActionsTray from '../objects/actions-tray';
// import PreparationState from '../../states/preparation';
// import FightingState from '../../states/fighting';
// import State from '../../states/state';
// import GameWorld from 'feh-battles/dec/world';

const squareSize = 125;
const squaresOffset = 63;
const fixedY = 120;

function gridToPixels(x: number, y: number) {
    return {
        x: x * squareSize - squaresOffset,
        y: y * squareSize + fixedY,
    }
}

// function pixelsToGrid(x: number, y: number) {
//   return {
//     x: Math.round((squaresOffset + x) / squareSize),
//     y: Math.round((y - fixedY) / squareSize)
//   };
// }

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


// function createDoubleTapHandler() {
//   const dblClickMargin = 300;
//   let previousTimeStamp = 0;
//   return (timeStamp: number) => {
//     const isDoubleTap = timeStamp - previousTimeStamp <= dblClickMargin;
//     previousTimeStamp = timeStamp;
//     return isDoubleTap;
//   };
// }

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainScene" });
    }

    rng = new Phaser.Math.RandomDataGenerator();
    private heroesLayer: GameObjects.Layer;
    private unitInfosBanner: UnitInfosBanner;
    private playHeroQuote = createHeroQuoter(this);

    create() {
        const entities = this.game.registry.list.world || DEBUG_ENTITIES as typeof DEBUG_ENTITIES;
        this.add.image(0, 180, "map").setDisplaySize(750, 1000).setOrigin(0, 0);
        this.heroesLayer = this.add.layer();
        this.unitInfosBanner = new UnitInfosBanner(this).setVisible(false);
        for (let entityId in entities) {
            const entity = entities[entityId];
            const hero = this.addHero(entity).setInteractive();
            hero.on("pointerdown", () => {
                this.unitInfosBanner.setVisible(true).setHero(hero);
                this.playHeroQuote(hero);
            });
        }
        this.add.existing(this.unitInfosBanner);
        this.startBackgroundMusic(0.2);
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
        const heroObject = new Hero(this, x, y, entity).setInteractive();
        this.heroesLayer.add(heroObject);
        return heroObject;
    }
}

// export default class MainScene extends Phaser.Scene {
//   walkTiles: string[] = [];
//   enemyRangeCoords: string[] = [];
//   attackTiles: string[] = [];
//   positionTiles: string[] = [];
//   heroesWhoMoved: Hero[] = [];
//   turn: Team = "team1";
//   enemyRangeLayer: GameObjects.Layer;
//   movementRangeLayer: GameObjects.Layer;
//   temporaryAssetsLayer: GameObjects.Layer;
//   heroBackground: Phaser.GameObjects.Rectangle;
//   movementArrows: GameObjects.Group;
//   movementAllowedImages: Phaser.GameObjects.Group;
//   movementAllowedTween: Phaser.Tweens.Tween;
//   combatForecast: CombatForecast;
//   interactionIndicator: InteractionIndicator;
//   interactionIndicatorTween: Tweens.Tween;
//   fpsText: GameObjects.Text;
//   actionsTray = new ActionsTray(this);
//   rosary: GameObjects.Image;
//   endArrow: GameObjects.Image;
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
//     this.walkTiles = [];
//     this.attackTiles = [];
//     this.states = {
//       preparation: new PreparationState(this),
//       fighting: new FightingState(this)
//     };

//     this.currentState = this.states.preparation;
//   }

//   fillTiles(tiles: string[], fillColor: number, alpha = 1) {
//     for (let tileName of tiles) {
//       const tile = this.getTile(tileName);
//       tile.setFillStyle(fillColor, alpha);
//     }
//   }

//   activateHero(hero: Hero) {
//     hero.on("drag", (_, dragX: number, dragY: number) => {
//       hero.x = dragX;
//       hero.y = dragY;
//     });
//     hero.on("dragenter", (_, target: GameObjects.Rectangle | Hero) => {
//       this.combatForecast.disable();
//       this.interactionIndicatorTween?.stop();
//       this.interactionIndicator.setVisible(false);
//       if (target instanceof GameObjects.Rectangle && this.walkTiles.includes(target.name)) {
//         const movementImage = this.children.getByName(`movement-${hero.name}`) as GameObjects.Image;
//         movementImage.x = target.x;
//         movementImage.y = target.y;
//         movementImage.setVisible(true);
//         const path = battle.crossTile(hero.getInternalHero(), target.name, this.walkTiles);
//         this.renderPath(path);
//         this.sound.playAudioSprite("sfx", "hover");
//       }

//       const actions = battle.decideDragAction(target.name, hero.getInternalHero(), this.walkTiles, this.attackTiles);
//       if (actions) {
//         for (let action of actions) {
//           this.processAction(action);
//         }
//       }
//     });

//     hero.on("dragend", () => {
//       const targetTile = pixelsToGrid(hero.x, hero.y);
//       const actions = battle.decideDragDropAction(targetTile.x + "-" + targetTile.y, hero.getInternalHero(), this.walkTiles, this.attackTiles);
//       for (let action of actions) {
//         this.processAction(action);
//       }
//       this.rosary.setVisible(false);
//     });

//     hero.on("pointerdown", ({ event: { timeStamp } }) => {
//       battle.resetPathfinder(pixelsToGrid(hero.x, hero.y));
//       this.clearTiles(this.walkTiles.concat(this.attackTiles));

//       if (this.handleDoubleTap(timeStamp)) {
//         this.sound.play("confirm");
//         this.endAction(hero);
//         return;
//       }
//       this.movementAllowedImages.setVisible(false);
//       const img = this.children.getByName(`movement-${hero.name}`) as GameObjects.Image;
//       img.setVisible(true).setAlpha(1);
//       this.movementAllowedTween.pause();
//       this.displayHeroInformations(hero);
//     });
//   }

//   processAction(action: UIAction) {
//     switch (action.type) {
//       case "display-enemy-range": {
//         const { enabled } = action;
//         this.displayEnemyRange(enabled);
//         break;
//       };

//       case "cancel": {
//         const { args: { x, y, hero } } = action;
//         this.endArrow.setVisible(false);
//         this.movementArrows.clear(true, true);
//         const pxCoords = gridToPixels(x, y);
//         this.tweens.add({
//           targets: this.heroesLayer.getByName(hero.id),
//           x: pxCoords.x,
//           y: pxCoords.y,
//           duration: 100
//         });

//         battle.resetPathfinder({ x, y });
//       }
//         break;
//       case "move": {
//         const { args: { x, y, hero } } = action;
//         this.endArrow.setVisible(false);
//         this.movementArrows.clear(true, true);
//         const pxCoords = gridToPixels(x, y);
//         const heroObject = this.getByName<Hero>(hero.id);
//         heroObject.x = pxCoords.x;
//         heroObject.y = pxCoords.y;
//         battle.moveHero(hero, { x, y });
//       }
//         break;
//       case "disable": {
//         const { args } = action;
//         const hero = this.getByName<Hero>(args.id);
//         this.endAction(hero);
//       }
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

//   getHeroCoordinates(hero: Hero) {
//     const coordinatesVector = new Phaser.Math.Vector2(hero.x, hero.y);
//     coordinatesVector.add(hero.image.getCenter());

//     return coordinatesVector;
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

//   runCombat(outcome: CombatOutcome) {
//     const timeline = this.add.timeline([]);
//     for (let i = 0; i < outcome.turns.length; i++) {
//       const turn = outcome.turns[i];
//       const damageText = this.createDamageText(turn).setVisible(false);
//       this.add.existing(damageText);
//       const attackerObject = this.getByName<Hero>(turn.attacker.id);
//       const defenderObject = this.getByName<Hero>(turn.defender.id);
//       const attackerCoordinates = this.getHeroCoordinates(attackerObject);
//       const defenderCoordinates = this.getHeroCoordinates(defenderObject);
//       const damageTween = this.tweens.create({
//         targets: [damageText],
//         y: "-=20",
//         duration: 150,
//         yoyo: true,
//         onStart: () => {
//           damageText.setVisible(true);
//         },
//         onComplete: () => {
//           this.children.remove(damageText);
//           damageText.destroy(true);
//         }
//       }) as Tweens.Tween;
//       // add special trigger effect
//       timeline.add([{
//         at: i * 800 + 400,
//         tween: {
//           targets: attackerObject,
//           x: `-=${(attackerCoordinates.x - defenderCoordinates.x) / 2}`,
//           y: `-=${(attackerCoordinates.y - defenderCoordinates.y) / 2}`,
//           yoyo: true,
//           duration: 150,
//           onYoyo: () => {
//             this.sound.play("hit");
//             defenderObject.updateHP(turn.remainingHP);
//             const combatAttacker = this.getByName<Hero>(outcome.attacker.id);
//             const combatDefender = this.getByName<Hero>(outcome.defender.id);
//             const attackerRatio = combatAttacker.getInternalHero().stats.hp / combatAttacker.getInternalHero().maxHP;
//             const defenderHPRatio = combatDefender.getInternalHero().stats.hp / combatDefender.getInternalHero().maxHP;
//             this.combatForecast.updatePortraits(attackerRatio, defenderHPRatio);
//           }
//         }
//       }]);
//       timeline.add([{
//         at: i * 800 + 475,
//         tween: damageTween
//       }, {
//         at: i * 800 + 475,
//         tween: defenderObject.createFlashTween()
//       }]);
//     }

//     const deadUnit = [outcome.attacker, outcome.defender].find((hero) => hero.remainingHP === 0);
//     if (deadUnit) {
//       const deadUnitObject = this.getByName<Hero>(deadUnit.id);
//       const koTween = this.createKOTween(deadUnitObject);

//       timeline.add([{ tween: koTween, at: 800 * outcome.turns.length + 500 }])
//     }

//     if (outcome.attacker.remainingHP) {
//       timeline.add([{
//         at: 800 * outcome.turns.length + 900,
//         tween: {
//           targets: [],
//           onComplete: () => {
//             const attackerObject = this.getByName<Hero>(outcome.attacker.id);
//             this.endAction(attackerObject);
//           }
//         }
//       }]);
//     }

//     timeline.add([{
//       at: 800 * outcome.turns.length + 600,
//       tween: {
//         targets: [],
//         onComplete: () => {
//           this.combatForecast.disable();
//           this.game.input.enabled = true;
//         }
//       }
//     }]);

//     this.game.input.enabled = false;
//     this.interactionIndicatorTween?.stop();
//     this.interactionIndicator.setVisible(false);
//     timeline.play();
//   };

//   resetView() {
//     this.movementRangeLayer.removeAll();
//     this.clearTiles(this.walkTiles.concat(this.attackTiles));
//     this.walkTiles = [];
//     this.attackTiles = [];
//     this.highlightIdleHeroes();
//     this.unitInfosBanner.setVisible(false);
//   }

//   clearTiles(tiles: string[]) {
//     this.movementRangeLayer.removeAll();
//     for (let tileName of tiles) {
//       this.getTile(tileName).setFillStyle(0x0).off("pointerdown").on("pointerdown", () => {
//         this.resetView();
//       });
//     }
//   }

//   displayHeroInformations(hero: Hero) {
//     this.displayRanges(hero.getInternalHero());
//     this.sound.playAudioSprite("sfx", "tap");
//     this.unitInfosBanner.setVisible(true).setHero(hero);
//   }

//   endAction(hero: Hero) {
//     hero.off("drag");
//     hero.off("dragover");
//     hero.off("dragenter");
//     hero.off("dragleave");
//     hero.off("dragend");
//     hero.off("pointerdown").on("pointerdown", () => {
//       this.displayHeroInformations(hero);
//     });
//     this.input.setDraggable(hero, false);
//     battle.resetPathfinder(hero.getInternalHero().coordinates);
//     hero.image.setTint(0x777777);
//     this.sound.play("confirm");
//     this.heroesWhoMoved.push(hero);
//     this.children.remove(this.children.getByName("movement-" + hero.name));
//     this.endArrow.setVisible(false);
//     this.highlightIdleHeroes();
//     this.movementArrows.clear(true, true);
//     this.clearTiles(this.walkTiles.concat(this.attackTiles));
//   }

//   highlightIdleHeroes() {
//     this.movementAllowedImages.setVisible(true);
//     (this.movementAllowedTween.targets as GameObjects.Image[]).forEach((image) => {
//       image.setAlpha(1);
//     });
//     this.movementAllowedTween.resume();
//   }

//   killHero(hero: Hero) {
//     this[hero.team] = this[hero.team].filter(({ name }) => name !== hero.name);
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

//   createTiles() {
//     for (let y = 1; y < 9; y++) {
//       for (let x = 1; x < 7; x++) {
//         const { x: screenX, y: screenY } = gridToPixels(x, y);
//         const name = x + "-" + y;
//         const tile = this.add.rectangle(screenX, screenY, squareSize, squareSize, 0x0).setAlpha(0.2).setName(name).setInteractive(undefined, undefined, true);
//         tile.on("pointerdown", () => {
//           if (!this.walkTiles.includes(name) && this.unitInfosBanner.visible) {
//             this.sound.playAudioSprite("sfx", "cancel");
//             this.resetView();
//           }
//         });
//         // uncomment if you need to check tile coordinates
//         this.add.text(tile.getCenter().x, tile.getCenter().y, name, {
//           fontSize: "18px"
//         });
//       }
//     }
//   }

//   handleDoubleTap = createDoubleTapHandler();

//   setTurn({ turn, turnCount }: { turn: Team, turnCount: number }) {
//     this.movementAllowedImages.clear(true, true);
//     const otherTeam = turn === "team1" ? "team2" : "team1";
//     if (turn !== this.turn) {
//       this.movementRangeLayer.removeAll();
//     }

//     for (let heroId in battle.state.teams[battle.state.currentTurn].members) {
//       const hero = this.getByName<Hero>(heroId);
//       const { x, y } = pixelsToGrid(hero.x, hero.y);
//       let currentCoords: Coords = { x, y };
//       this.input.setDraggable(hero, true);
//       const img = new Phaser.GameObjects.Image(this, hero.x, hero.y, "movement-allowed").setName(`movement-${hero.name}`);
//       const matchingTile = this.getTile(currentCoords.x + "-" + currentCoords.y);
//       img.setDisplaySize(matchingTile.width, matchingTile.height);
//       this.movementAllowedImages.add(img, true);
//       this.activateHero(hero);
//     }

//     if (turnCount > 1) {
//       this.currentState = this.states.fighting;
//     } else {
//       this.currentState = this.states.preparation;
//     }

//     this.currentState.changeActionsTray(this.actionsTray);

//     this.movementAllowedTween?.stop().destroy();
//     this.movementAllowedTween = this.tweens.add({
//       targets: this.movementAllowedImages.getChildren(),
//       loop: -1,
//       yoyo: true,
//       duration: 900,
//       alpha: 0,
//     });

//     for (let heroId in battle.state.teams[otherTeam].members) {
//       const hero = this.getByName<Hero>(heroId);
//       hero.off("dragend");
//       hero.image.clearTint();
//       this.input.setDraggable(hero, false);
//       hero.off("dragstart");
//       hero.off("dragenter");
//       hero.off("pointerdown").on("pointerdown", () => {
//         this.displayHeroInformations(hero);
//       });
//     }

//     battle.resetEffects(otherTeam);
//     const effects = battle.getTurnStartEffects(turn);

//     for (let effect of effects) {
//       const target = this.getByName<Hero>(effect.targetHeroId);
//       if (target && effect.appliedEffect.stats) {
//         target.getInternalHero().setMapBoosts(effect.appliedEffect.stats);
//         target.statuses.push("buff");
//       }
//     }
//   }

//   getByName<T extends GameObjects.GameObject>(name: string): T {
//     return this.heroesLayer.getByName(name) as T;
//   }

//   renderPath(path: { start: string, end: string, tilesInBetween: string[] }) {
//     this.movementArrows.setVisible(true).clear(true, true);
//     const { start, end, tilesInBetween } = path;
//     const fullPath = [start].concat(tilesInBetween).concat(end);
//     const startTile = this.getTile(start);
//     const endTile = this.getTile(end);
//     const { x: startX, y: startY } = startTile.getCenter();
//     this.rosary.x = startX;
//     this.rosary.y = startY;
//     this.rosary.setVisible(true);
//     this.endArrow.x = endTile.x;
//     this.endArrow.y = endTile.y;
//     this.endArrow.setVisible(end !== start);
//     console.log({ fullPath });
//     const endArrowDirection = getTilesDirection(toCoords(fullPath[fullPath.length - 2]), toCoords(end));
//     const verticalAngle = endArrowDirection === "down" ? 90 : endArrowDirection === "up" ? -90 : null;
//     const horizontalAngle = endArrowDirection === "left" ? 180 : endArrowDirection === "right" ? 0 : null;
//     const finalAngle = verticalAngle ?? horizontalAngle;
//     this.endArrow.setAngle(finalAngle);

//     if (start !== end) {
//       this.rosary.setTexture("rosary-arrow");
//       const rosaryDirection = getTilesDirection(toCoords(start), toCoords(fullPath[1]));
//       const verticalAngle = rosaryDirection === "down" ? 0 : rosaryDirection === "up" ? 180 : null;
//       const horizontalAngle = rosaryDirection === "left" ? 90 : rosaryDirection === "right" ? -90 : null;
//       const finalAngle = verticalAngle ?? horizontalAngle;
//       this.rosary.setAngle(finalAngle);
//     }

//     if (tilesInBetween) {
//       for (let i = 0; i < tilesInBetween.length; i++) {
//         const tile = tilesInBetween[i];
//         const previousTile = i === 0 ? start : tilesInBetween[i - 1];
//         const nextTile = i === tilesInBetween.length - 1 ? end : tilesInBetween[i + 1];
//         const gameTile = this.getTile(tile);
//         const fromPreviousTile = getTilesDirection(toCoords(previousTile), toCoords(tilesInBetween[i]));
//         const toNextTile = getTilesDirection(toCoords(tilesInBetween[i]), toCoords(nextTile));
//         const tileCenter = gameTile.getCenter();
//         if (fromPreviousTile === toNextTile) {
//           const straightPath = new GameObjects.Image(this, tileCenter.x, tileCenter.y, `path-${fromPreviousTile}`);
//           this.movementArrows.add(straightPath, true);
//         } else {
//           const elbow = new GameObjects.Image(this, tileCenter.x, tileCenter.y, `path-${fromPreviousTile}-${toNextTile}`);
//           this.movementArrows.add(elbow, true);
//         }
//       }
//     }
//   }

//   // todo: simplify signature
//   addHero(heroData: HeroData, team: Team) {
//     const { x, y } = gridToPixels(heroData.coordinates.x, heroData.coordinates.y);
//     const heroObject = new Hero(this, x, y, heroData, team).setInteractive();
//     this.heroesLayer.add(heroObject);
//     return heroObject;
//   }

//   switchPositionsMode() {
//     this.currentState = this.states.preparation;
//     this.currentState.changeActionsTray(this.actionsTray);
//     battle.resetEffects(this.turn);
//     this.movementAllowedTween.pause();
//     this.movementAllowedImages.setVisible(false);
//     const team = battle[this.turn];
//     for (let id in team) {
//       const hero = team[id];
//       const heroObj = this.getByName<Hero>(hero.id);
//       heroObj.off("pointerdown").off("dragenter").off("dragend").on("pointerdown", () => {
//         this.displayHeroInformations(heroObj);
//       }).on("dragend", () => {
//         const target = pixelsToGrid(heroObj.x, heroObj.y);
//         const actions = battle.decideDragDropAction(target.x + "-" + target.y, hero, [], [], true);
//         for (let action of actions) {
//           this.processAction(action);
//         }
//       });
//       const tile = this.children.getByName(hero.coordinates.x + "-" + hero.coordinates.y) as GameObjects.Rectangle;
//       tile.setFillStyle(0x00FF00);
//       this.positionTiles.push(hero.coordinates.x + "-" + hero.coordinates.y);
//     }
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

//   create() {
//     this.heroesLayer = this.add.layer();
//     this.enemyRangeLayer = this.add.layer();
//     this.movementRangeLayer = this.add.layer();
//     this.temporaryAssetsLayer = this.add.layer();
//     this.movementRangeLayer.setDepth(1);
//     this.enemyRangeLayer.setDepth(2);
//     this.heroesLayer.setDepth(3);
//     this.temporaryAssetsLayer.setDepth(4);
//     this.unitInfosBanner = this.add.existing(new UnitInfosBanner(this).setVisible(false)).setDepth(5);
//     this.combatForecast = this.add.existing(new CombatForecast(this).setVisible(false)).setDepth(5);
//     this.movementAllowedImages = this.add.group();
//     this.movementArrows = this.add.group();
//     this.add.rectangle(0, 180, 750, 1000, 0xFFFFFF).setOrigin(0);
//     const banner = this.add.image(-90, 0, "background").setOrigin(0).setTint(0x0F343D);
//     this.startBackgroundMusic(0.13);
//     banner.setDisplaySize(banner.displayWidth, 180);
//     this.add.image(0, 180, "map").setDisplaySize(750, 1000).setOrigin(0, 0).setDepth(0);
//     this.createTiles();

//     for (let heroId in battle.state.teams.team1.members) {
//       const hero = battle.state.teams.team1.members[heroId];
//       this.addHero(hero, "team1");
//     }

//     for (let heroId in battle.state.teams.team2.members) {
//       const hero = battle.state.teams.team2.members[heroId];
//       this.addHero(hero, "team2");
//     }

//     this.interactionIndicator = this.add.existing(new InteractionIndicator(this, 0, 0).setVisible(false).setDepth(6));
//     this.fpsText = renderText(this, 500, 120, "", { fontSize: "25px" });
//     this.rosary = this.add.image(0, 0, "rosary").setVisible(false);
//     this.endArrow = this.add.image(0, 0, "end-arrow").setVisible(false);
//     // const shine = this.add.particles(0, 0, "effect-shine", {
//     //   scale: {
//     //     start: 1,
//     //     end: 3
//     //   },
//     //   x: 150,
//     //   y: 250,
//     // });
//     this.processAction(battle.initiateBattle());
//   }

//   displayRanges(hero: HeroData) {
//     this.clearTiles(this.walkTiles.concat(this.attackTiles));
//     const walkTiles = battle.getMovementTiles(hero);
//     const weaponTiles = battle.getAttackTiles(hero, walkTiles);

//     const stringWalkTiles = walkTiles.map(stringifyTile);

//     for (let tile of weaponTiles) {
//       const { x, y } = gridToPixels(+tile[0], +tile[2]);
//       const img = new GameObjects.Rectangle(this, x, y, squareSize, squareSize, 0xFF0000, 0.2);
//       this.movementRangeLayer.add(img);
//     }

//     for (let tile of walkTiles) {
//       const { x, y } = gridToPixels(tile.x, tile.y);
//       const img = new GameObjects.Rectangle(this, x, y, squareSize, squareSize, 0x0000FF, 0.2);
//       this.movementRangeLayer.add(img);
//     }

//     this.walkTiles = walkTiles.map(stringifyTile);
//     this.attackTiles = weaponTiles;
//   }

//   getTile(name: string) {
//     return this.children.getByName(name) as Phaser.GameObjects.Rectangle;
//   }

//   update(_, delta: number) {
//     this.updateDelta += delta;
//     if (this.updateDelta >= 16.67 * 60) {
//       this.updateDelta = 0;
//       for (let heroId in battle.getHeroes()) {
//         const hero = this.getByName<Hero>(heroId);
//         hero.toggleStatuses();
//       }
//     }
//   }
// }

// function getTilesDirection(tile1: Coords, tile2: Coords) {
//   if (tile1.y !== tile2.y) {
//     return tile1.y < tile2.y ? "down" : "up";
//   }

//   if (tile1.x !== tile2.x) {
//     return tile1.x < tile2.x ? "right" : "left";
//   }
// };
