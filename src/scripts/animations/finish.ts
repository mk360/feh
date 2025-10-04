import { Types } from "phaser";
import Hero from "../objects/hero";
import MainScene from "../scenes/mainScene";

function finishAnimation(scene: MainScene, hero: Hero) {
    const timelineData: Types.Time.TimelineEventConfig[] = [{
        from: 300,
        run() {
            scene.clearMovementLayer();
            hero.disableMovementIndicator();
            scene.clearTiles();
            scene.combatForecast.setVisible(false);
            scene.assistPreview.setVisible(false);
            scene.disableDragging(hero);
            const matrix = hero.sprite.postFX.addColorMatrix();
            matrix.blackWhite(true);
            scene.heroesLayer.getChildren().forEach((child: Hero) => {
                if (child === hero) return;

                scene.toggleHeroState(child);
            });
        },
    }];

    return timelineData;
};

export default finishAnimation;
