import { GameObjects, Tweens, Types } from "phaser";
import Hero from "../objects/hero";
import MainScene from "../scenes/mainScene";

function gravityAnimation(scene: MainScene, hero: Hero) {
    const heroCoordinates = hero.getAbsoluteCoordinates();
    const gravityRing = new GameObjects.Image(scene, heroCoordinates.x, heroCoordinates.y - 50, "gravity-ring").setAlpha(0);
    const eventsData: Types.Time.TimelineEventConfig[] = [{
        from: 0,
        tween: {
            targets: [gravityRing],
            alpha: 1,
            y: heroCoordinates.y + 40,
            duration: 700,
            ease: Tweens.Builders.GetEaseFunction("Sine"),
            onStart: () => {
                scene.add.existing(gravityRing);
                scene.sound.play("gravity");
            },
            onComplete: () => {
                gravityRing.destroy();
            }
        }
    }];

    return eventsData;
};

export default gravityAnimation;
