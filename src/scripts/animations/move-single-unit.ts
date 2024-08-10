import { Time, Types } from "phaser";
import Hero from "../objects/hero";
import { gridToPixels } from "../utils/grid-functions";
import MainScene from "../scenes/mainScene";

function MoveSingleUnit(scene: MainScene, target: Hero, targetCoordinates: { x: number; y: number }) {
    console.log({ target });
    const { x: pxX, y: pxY } = gridToPixels(targetCoordinates.x, targetCoordinates.y);
    console.log({ pxX, pxY, x: target.x, y: target.y });
    const timeline = new Time.Timeline(scene, [{
        tween: {
            targets: [target],
            x: pxX,
            y: pxY,
            duration: 100
        }
    }]);

    return timeline;
};

export default MoveSingleUnit;
