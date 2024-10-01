import { Types } from "phaser";
import Hero from "../objects/hero";
import MainScene from "../scenes/mainScene";

function killAnimation(scene: MainScene, hero: Hero) {
    const fadeDuration = 1000;

    const timelineData: Types.Time.TimelineEventConfig[] = [{
        from: 500,
        tween: {
            targets: [hero.sprite],
            alpha: 0,
            duration: fadeDuration,
            onStart() {
                hero.glowingSprite.setAlpha(1);
                scene.tweens.add({
                    targets: [hero.glowingSprite],
                    alpha: 0,
                    delay: 100,
                    duration: fadeDuration
                }).play();
            },
            onComplete() {
                scene.sound.playAudioSprite("battle-sfx", "ko");
                scene.heroesLayer.remove(hero);
                hero.destroy();
            }
        }
    }];

    return timelineData;
};

export default killAnimation;
