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
