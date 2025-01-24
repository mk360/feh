import effectTriggerAnimation from "./scripts/animations/effect-trigger";
import mapBuffAnimation from "./scripts/animations/map-buff";
import mapDebuffAnimation from "./scripts/animations/map-debuff";
import Hero from "./scripts/objects/hero";
import MainScene from "./scripts/scenes/mainScene";
import playerPhase from "./scripts/animations/player-phase";
import enemyPhase from "./scripts/animations/enemy-phase";
import MoveSingleUnit from "./scripts/animations/move-single-unit";
import MoveMultipleUnits from "./scripts/animations/move-multiple-units";
import combatAnimation from "./scripts/animations/combat";
import finishAnimation from "./scripts/animations/finish";
import { Time } from "phaser";
import refreshAnimation from "./scripts/animations/refresh";
import killAnimation from "./scripts/animations/kill";
import damageAnimation from "./scripts/animations/damage";
import gravityAnimation from "./scripts/animations/gravity";

import PivotAssist from "./scripts/animations/assists/pivot";
import SwapAssist from "./scripts/animations/assists/swap";
import SmiteAssist from "./scripts/animations/assists/smite";
import ShoveAssist from "./scripts/animations/assists/shove";
import DrawBack from "./scripts/animations/assists/draw-back";
import RepositionAssist from "./scripts/animations/assists/reposition";

const animationKeys = {
    "trigger": effectTriggerAnimation,
    "Penalty": mapDebuffAnimation,
    "Bonus": mapBuffAnimation,
    "finish": finishAnimation,
    "kill": killAnimation,
    "Gravity": gravityAnimation,
    refresh: refreshAnimation
};

const assistAnimations = {
    "Pivot": PivotAssist,
    "Swap": SwapAssist,
    "Smite": SmiteAssist,
    "Shove": ShoveAssist,
    "Reposition": RepositionAssist,
    "Draw Back": DrawBack,
}

function parseServerResponse(scene: MainScene, lines: string[]) {
    const animations: Time.Timeline[][] = [];

    for (let line of lines) {
        const effects = line.split(",");
        const timelineArray: Time.Timeline[] = [];
        for (let effect of effects) {
            const args = effect.split(" ");

            switch (args[0]) {
                case "turn": {
                    scene.currentTurn = args[1];
                    const isCurrentSide = scene.side === args[1];
                    const newTurnAnimation = isCurrentSide ? playerPhase : enemyPhase;
                    const timeline = newTurnAnimation(scene, +args[2]);
                    timelineArray.push(timeline);
                    break;
                }

                case "move": {
                    const [, target, x, y] = args;
                    const targetHero = scene.heroesLayer.getByName(target) as Hero;
                    const movementAnimation = MoveSingleUnit(scene, targetHero, { x: +x, y: +y });
                    timelineArray.push(movementAnimation);
                    break;
                }

                case "assist-movement": {
                    const [, assistName, source, target, sourceHeroCoordinates, targetHeroCoordinates] = args;
                    if (assistName in assistAnimations) {
                        const targetHero = scene.heroesLayer.getByName(target) as Hero;
                        const sourceHero = scene.heroesLayer.getByName(source) as Hero;
                        const animation = assistAnimations[assistName as keyof typeof assistAnimations](scene, sourceHero, targetHero, sourceHeroCoordinates, targetHeroCoordinates);
                        const animationTimeline = new Time.Timeline(scene, animation);
                        timelineArray.push(animationTimeline);
                    } else {
                        console.warn(`No animation was found for ${assistName}`);
                    }
                    break;
                }

                case "map-damage": {
                    const payload = line.split("|");
                    const damageAnimations = payload.map((entry) => {
                        const [, targetId, damage, remainingHP] = entry.split(" ");
                        const target = scene.heroesLayer.getByName(targetId) as Hero;
                        const displayedDamage = damageAnimation(scene, target, +damage, "medium", +remainingHP);

                        return {
                            tween: displayedDamage,
                        };
                    });

                    const timeline = new Time.Timeline(scene, damageAnimations);
                    timelineArray.push(timeline);
                    const pauseTimeline = new Time.Timeline(scene, [{
                        from: 300,
                        run() {
                            // bonjour
                        }
                    }]);
                    timelineArray.push(pauseTimeline);
                    break;
                }

                case "attack": {
                    scene.clearMovementLayer();
                    scene.interactionsIndicator.disable();
                    const animations = combatAnimation(scene, effect);
                    const timeline = new Time.Timeline(scene, animations);
                    timelineArray.push(timeline);

                    break;
                }

                default: {
                    const [animation, target] = args;
                    if (animation in animationKeys) {
                        const hero = scene.heroesLayer.getByName(target) as Hero;
                        const animData = animationKeys[animation as keyof typeof animationKeys](scene, hero);
                        const timeline = new Time.Timeline(scene, animData);
                        timelineArray.push(timeline);
                    }
                }
            }
        }
        animations.push(timelineArray);
    }

    return animations;
};

export default parseServerResponse;
