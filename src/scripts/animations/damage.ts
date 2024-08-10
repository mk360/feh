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
            fontSize: 10
        }
    });

    const damageTween = scene.tweens.create({
        targets: [damageText],
        y: "-=20",
        duration: 150,
        yoyo: true,
        onStart: () => {
            damageText.setVisible(true);
            scene.sound.playAudioSprite("battle-sfx", "hit");
        },
        onComplete: () => {
            this.children.remove(damageText);
            damageText.destroy(true);
        }
    }) as Tweens.Tween;
}