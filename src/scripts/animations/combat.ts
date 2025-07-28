import { Types } from "phaser";
import MainScene from "../scenes/mainScene";
import damageAnimation from "./damage";
import Hero from "../objects/hero";
import { gridToPixels } from "../utils/grid-functions";
import effectTriggerAnimation from "./effect-trigger";
import healingAnimation from "./healing";

function combatAnimation(scene: MainScene, payload: string) {
    const tweens: (Types.Time.TimelineEventConfig & { name?: string })[] = [];
    const events = payload.split("|");
    const initiator = events[0].split(" ")[1];
    for (let i = 0; i < events.length; i++) {
        const [, attacker, attackerHP, attackerCooldown, shouldAttackerTriggerSpecial, damage, attackerHealing, defender, defenderHP, defenderCooldown, shouldDefenderTriggerSpecial, _, defenderHealing] = events[i].split(" ");
        const defenderObject = scene.heroesLayer.getByName(defender) as Hero;
        const attackerObject = scene.heroesLayer.getByName(attacker) as Hero;
        const attackerCoordinates = attackerObject.getInternalHero().Position[0];
        const attackerPosition = gridToPixels(attackerCoordinates.x, attackerCoordinates.y);
        attackerObject.x = attackerPosition.x;
        attackerObject.y = attackerPosition.y;
        const defenderCoordinates = defenderObject.getInternalHero().Position[0];
        const defenderPosition = gridToPixels(defenderCoordinates.x, defenderCoordinates.y);
        const damageTween = damageAnimation(scene, defenderObject, +damage, "medium", +defenderHP);

        if (shouldAttackerTriggerSpecial !== "false") {
            const skillTrigger = effectTriggerAnimation(scene, attackerObject);

            tweens.push({
                name: "special-trigger-attacker",
                from: 200,
            }, ...skillTrigger);
        }

        if (shouldDefenderTriggerSpecial !== "false") {
            const skillTrigger = effectTriggerAnimation(scene, defenderObject);

            tweens.push(...skillTrigger);
        }

        tweens.push({
            from: i ? 300 : 100,
            name: "make-attacker-movement",
            tween: {
                targets: [attackerObject],
                x: (defenderPosition.x + attackerPosition.x) / 2,
                y: (defenderPosition.y + attackerPosition.y) / 2,
                yoyo: true,
                duration: 200,
                onYoyo: () => {
                    scene.tweens.existing(damageTween);
                    attackerObject.updateHP(+attackerHP);
                    defenderObject.updateHP(+defenderHP);
                    attackerObject.updateSpecial(+attackerCooldown);
                    defenderObject.updateSpecial(+defenderCooldown);
                    const attackerRatio = +attackerHP / attackerObject.getInternalHero().Stats[0].maxHP;
                    const defenderHPRatio = +defenderHP / defenderObject.getInternalHero().Stats[0].maxHP;
                    if (attackerObject.name === initiator) {
                        scene.combatForecast.updatePortraits(attackerRatio, defenderHPRatio);
                    } else {
                        scene.combatForecast.updatePortraits(defenderHPRatio, attackerRatio);
                    }
                },
                onComplete: () => {
                    attackerObject.x = attackerPosition.x;
                    attackerObject.y = attackerPosition.y;
                },
            },
        });

        let attackerHealed = false;

        if (+attackerHealing) {
            attackerHealed = true;
            const healing = healingAnimation(scene, attackerObject, +attackerHealing, +attackerHP / attackerObject.getInternalHero().Stats[0].maxHP);

            tweens.push({
                name: "attacker-heal",
                from: 350,
                tween: healing
            });
        }

        if (+defenderHealing) {
            const healing = healingAnimation(scene, defenderObject, +defenderHealing, +defenderHP / defenderObject.getInternalHero().Stats[0].maxHP);

            tweens.push({
                name: "defender-heal",
                from: attackerHealed ? 0 : 350,
                tween: healing
            });
        }

        tweens.push({
            from: 500
        });
    }

    console.log(tweens)

    return tweens;
};

export default combatAnimation;
