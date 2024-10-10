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
                    const damageTween = damageAnimation(scene, defenderObject, +damage);
                    damageTween.play();
                    scene.sound.playAudioSprite("battle-sfx", "hit");
                    attackerObject.updateHP(+attackerHP);
                    attackerObject.updateSpecial(+attackerCooldown);
                    defenderObject.updateSpecial(+defenderCooldown);
                    defenderObject.updateHP(+defenderHP);
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