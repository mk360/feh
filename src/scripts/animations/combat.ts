import { Types } from "phaser";
import MainScene from "../scenes/mainScene";
import damageAnimation from "./damage";
import Hero from "../objects/hero";
import { gridToPixels } from "../utils/grid-functions";

function combatAnimation(scene: MainScene, payload: string) {
    const tweens: Types.Time.TimelineEventConfig[] = [];
    const events = payload.split("|");
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

        tweens.push({
            from: i ? 700 : 100,
            tween: {
                targets: [attackerObject],
                x: (defenderPosition.x + attackerPosition.x) / 2,
                y: (defenderPosition.y + attackerPosition.y) / 2,
                yoyo: true,
                duration: 200,
                onYoyo: () => {
                    const damageTween = damageAnimation(scene, defenderObject, +damage, "medium", +defenderHP);
                    damageTween.play();
                    scene.sound.playAudioSprite("battle-sfx", "hit");
                    attackerObject.updateHP(+attackerHP);
                    attackerObject.updateSpecial(+attackerCooldown);
                    defenderObject.updateSpecial(+defenderCooldown);
                    const attackerRatio = +attackerHP / attackerObject.getInternalHero().Stats[0].maxHP;
                    const defenderHPRatio = +defenderHP / defenderObject.getInternalHero().Stats[0].maxHP;
                    scene.combatForecast.updatePortraits(attackerRatio, defenderHPRatio);
                    if (+attackerHealing) {

                    }
                },
                onComplete: () => {
                    attackerObject.x = attackerPosition.x;
                    attackerObject.y = attackerPosition.y;
                },
            }
        });
    }

    return tweens;
};

export default combatAnimation;
