import { GameObjects, Tweens, Types } from "phaser";
import Hero from "../objects/hero";
import MainScene from "../scenes/mainScene";

function effectTriggerAnimation(scene: MainScene, hero: Hero) {
    const coordinates = hero.getAbsoluteCoordinates();
    const effectCircle = new GameObjects.Image(scene, coordinates.x, coordinates.y, "effect");
    const effectGleam = new GameObjects.Image(scene, coordinates.x, coordinates.y, "effect-blur").setDisplaySize(effectCircle.displayWidth, effectCircle.displayHeight);
    const tweens: Types.Time.TimelineEventConfig[] = [{
        tween: {
            targets: [effectCircle, effectGleam],
            scale: 1.2,
            alpha: 0,
            duration: 120,
            onStart: () => {
                scene.add.existing(effectCircle);
                scene.add.existing(effectGleam);
                scene.sound.play("effect-trigger");
            },
        }
    }, {
        from: 120,
        tween: {
            targets: [effectCircle, effectGleam],
            duration: 96,
            scale: 0,
            onComplete: () => {
                effectCircle.destroy();
                effectGleam.destroy();
            }
        }
    }];

    return tweens;
};

export default effectTriggerAnimation;
