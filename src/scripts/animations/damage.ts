import { Tweens } from "phaser";
import Hero from "../objects/hero";
import MainScene from "../scenes/mainScene";
import { renderDamageText } from "../utils/text-renderer";

function damageAnimation(scene: MainScene, target: Hero, amount: number) {
    const damageText = renderDamageText({
        scene,
        ...target.getAbsoluteCoordinates(),
        content: amount,
        style: {
            fontSize: 25
        }
    });

    damageText.setOrigin(0.5);

    const damageTween = scene.tweens.add({
        targets: [damageText],
        y: "-=20",
        duration: 150,
        yoyo: true,
        onStart: () => {
            scene.add.existing(damageText);
            damageText.setVisible(true);
            scene.sound.playAudioSprite("battle-sfx", "hit");
        },
        onComplete: () => {
            scene.children.remove(damageText);
            damageText.destroy(true);
        }
    }) as Tweens.Tween;

    return damageTween;
}

export default damageAnimation;
