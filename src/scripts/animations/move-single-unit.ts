import { Time } from "phaser";
import Hero from "../objects/hero";
import { gridToPixels } from "../utils/grid-functions";
import MainScene from "../scenes/mainScene";

function MoveSingleUnit(scene: MainScene, target: Hero, targetCoordinates: { x: number; y: number }) {
    const { x: pxX, y: pxY } = gridToPixels(targetCoordinates.x, targetCoordinates.y);
    console.log(target.getInternalHero().Name, target.getInternalHero().Position, targetCoordinates)
    target.getInternalHero().Position = [targetCoordinates]; // optimistic assignment while we wait for the server
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
