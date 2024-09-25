import { Types } from "phaser";
import Hero from "../objects/hero";
import MainScene from "../scenes/mainScene";

function finishAnimation(scene: MainScene, hero: Hero) {
    const timelineData: Types.Time.TimelineEventConfig[] = [{
        run() {
            scene.clearMovementLayer();
            hero.disableMovementIndicator();
            scene.clearTiles();
            scene.combatForecast.setVisible(false);
            scene.input.setDraggable(hero, false);
            scene.heroesLayer.getChildren().forEach((child: Hero) => {
                if (!child.getInternalHero().Finished) child.enableMovementIndicator();
            });
        },
    }];

    return timelineData;
};

export default finishAnimation;
