import { Types } from "phaser";
import Hero from "../objects/hero";
import MainScene from "../scenes/mainScene";

function finishAnimation(scene: MainScene, hero: Hero) {
    const timelineData: Types.Time.TimelineEventConfig[] = [{
        tween: {
            targets: [hero],
            onStart() {
                scene.clearMovementLayer();
                hero.disableMovementIndicator();
                scene.input.setDraggable(hero, false);
            },
            duration: 100,
        },
        from: 0
    }];

    return timelineData;
};

export default finishAnimation;
