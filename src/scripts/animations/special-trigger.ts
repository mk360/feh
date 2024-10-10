import { GameObjects, Math, Types } from "phaser";
import Hero from "../objects/hero";
import MainScene from "../scenes/mainScene";

function specialTriggerAnimation(scene: MainScene, hero: Hero, postSpecialCooldown: number) {
    const coordinates = hero.sprite.getCenter(new Phaser.Math.Vector2(), true);
    const effectCircle = new GameObjects.Image(scene, coordinates.x, coordinates.y, "offensive-special-effect");
    const effectGleam = new GameObjects.Image(scene, coordinates.x, coordinates.y, "effect-blur").setDisplaySize(effectCircle.displayWidth, effectCircle.displayHeight);

    const tweens: Types.Time.TimelineEventConfig[] = [{
        tween: {
            targets: [effectCircle, effectGleam],
            scale: 1.5,
            alpha: 0,
            duration: 180,
            onStart: () => {
                scene.add.existing(effectCircle);
                scene.add.existing(effectGleam);
                scene.sound.play("effect-trigger");
            },
        }
    }, {
        from: 0,
        run() {
            effectCircle.destroy();
            effectGleam.destroy();
            hero.updateSpecial(postSpecialCooldown);
            hero.specialText.setVisible(true).setText(postSpecialCooldown.toString());
        }
    }];

    return tweens;
};

export default specialTriggerAnimation;
