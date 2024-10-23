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
import { Time, Types } from "phaser";
import killAnimation from "./scripts/animations/kill";
import damageAnimation from "./scripts/animations/damage";

const animationKeys = {
    "trigger": effectTriggerAnimation,
    "Penalty": mapDebuffAnimation,
    "Bonus": mapBuffAnimation,
    "finish": finishAnimation,
    "kill": killAnimation,
};

function parseServerResponse(scene: MainScene, lines: string[]) {
    const animations: Time.Timeline[][] = [];

    for (let line of lines) {
        const effects = line.split(",");
        const timelineArray: Time.Timeline[] = [];
        for (let effect of effects) {
            const args = effect.split(" ");
            console.log(args[0]);
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

                case "move-multiple": {
                    args.shift();
                    const stringified = args.join("");
                    const affectedEntities = stringified.split("|");
                    const mapped = affectedEntities.map((message) => {
                        const [target, targetX, targetY] = message.split(" ");
                        return {
                            target,
                            coords: {
                                x: +targetX,
                                y: +targetY
                            }
                        }
                    });
                    const animation = MoveMultipleUnits(scene, mapped);
                    timelineArray.push(animation);
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
