import { Types } from "phaser";
import Hero from "../../objects/hero";
import MainScene from "../../scenes/mainScene";
import toCoords from "../../../utils/to-coords";
import { gridToPixels } from "../../utils/grid-functions";

function SwapAssist(scene: MainScene, assisting: Hero, assisted: Hero, targetHeroCoordinates: string, sourceHeroCoordinates: string) {
    const { x: sourceX, y: sourceY } = toCoords(sourceHeroCoordinates);
    const { x: targetX, y: targetY } = toCoords(targetHeroCoordinates);
    const pxSourceCoords = gridToPixels(sourceX, sourceY);
    const pxTargetCoords = gridToPixels(targetX, targetY);

    const timelineData: Types.Time.TimelineEventConfig[] = [{
        from: 0,
        tween: {
            targets: [assisting],
            x: pxTargetCoords.x,
            y: pxTargetCoords.y,
            duration: 100,
        }
    }, {
        from: 0,
        tween: {
            targets: [assisted],
            x: pxSourceCoords.x,
            y: pxSourceCoords.y,
            duration: 100
        }
    }];

    return timelineData;
};

export default SwapAssist;
