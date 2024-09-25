import { Types } from "phaser";
import Hero from "../objects/hero";
import MainScene from "../scenes/mainScene";

function killAnimation(scene: MainScene, hero: Hero) {
    const timelineData: Types.Time.TimelineEventConfig[] = [{
        from: 400,
        tween: {
            targets: [hero.sprite],
            alpha: 0,
            duration: 500,
            onStart() {
                hero.glowingSprite.setAlpha(1);
                scene.tweens.add({
                    targets: [hero.glowingSprite],
                    alpha: 0,
                    delay: 50,
                    duration: 500
                }).play();
                scene.sound.playAudioSprite("battle-sfx", "ko");
            },
            onComplete() {
                scene.heroesLayer.remove(hero);
                hero.destroy();
            }
        }
    }];

    return timelineData;
};

export default killAnimation;
