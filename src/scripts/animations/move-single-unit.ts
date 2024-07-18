import { Time } from "phaser";
import Hero from "../objects/hero";
import { gridToPixels } from "../utils/grid-functions";
import MainScene from "../scenes/mainScene";

function MoveSingleUnit(scene: MainScene, target: Hero, targetCoordinates: { x: number; y: number }) {
    const targetPixels = gridToPixels(targetCoordinates.x, targetCoordinates.y);
    const timeline = new Time.Timeline(scene, [{
        from: 0,
        tween: {
            targets: [target],
            onStart() {
                const { x, y } = target.getInternalHero();
                const { x: pxX, y: pxY } = gridToPixels(x, y);
                target.x = pxX;
                target.y = pxY;
            }
        }
    }, {
        from: 100,
        tween: {
            targets: [target],
            x: targetPixels.x,
            y: targetPixels.y,
            duration: 600
        }
    }]);

    return timeline;
};

export default MoveSingleUnit;
