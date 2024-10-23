import { Tweens } from "phaser";
import Hero from "../objects/hero";
import MainScene from "../scenes/mainScene";
import { renderDamageText } from "../utils/text-renderer";

function getDamageFontSize(format: "small" | "medium" | "big") {
    switch (format) {
        case "small": return 18;
        case "medium": return 25;
        case "big": return 36;
    }
}

function damageAnimation(scene: MainScene, target: Hero, amount: number, size: "small" | "medium" | "big", remainingHP: number) {
    const damageText = renderDamageText({
        scene,
        ...target.getAbsoluteCoordinates(),
        content: amount,
        style: {
            fontSize: getDamageFontSize(size)
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
        },
        onYoyo: () => {
            target.sprite.setAlpha(0);
            target.glowingSprite.setAlpha(1);
            scene.sound.playAudioSprite("battle-sfx", "hit");

            target.updateHP(remainingHP);

            scene.tweens.add({
                targets: [target.sprite],
                alpha: 1,
                duration: 150,
                onComplete: () => {
                    target.glowingSprite.setAlpha(0);
                }
            }).play();
        },
        onComplete: () => {
            scene.tweens.add({
                targets: [damageText],
                alpha: 0,
                delay: 100,
                duration: 100,
                onComplete() {
                    scene.children.remove(damageText);
                    damageText.destroy(true);
                }
            }).play();
        }
    }) as Tweens.Tween;

    return damageTween;
}

export default damageAnimation;