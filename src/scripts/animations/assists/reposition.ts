import { Types } from "phaser";
import { gridToPixels } from "../../utils/grid-functions";
import MainScene from "../../scenes/mainScene";
import Hero from "../../objects/hero";
import toCoords from "../../../utils/to-coords";

function RepositionAssist(scene: MainScene, assisting: Hero, assisted: Hero, sourceHeroCoordinates: string, targetHeroCoordinates: string) {
    const { x: targetX, y: targetY } = toCoords(sourceHeroCoordinates);
    const { x: sourceX, y: sourceY } = toCoords(targetHeroCoordinates);
    console.log({ targetX, targetY, sourceX, sourceY });
    const pxTargetCoords = gridToPixels(targetX, targetY);

    const timelineData: Types.Time.TimelineEventConfig[] = [{
        from: 0,
        tween: {
            targets: [assisted],
            x: pxTargetCoords.x,
            y: pxTargetCoords.y,
            duration: 100,
        }
    },
    {
        from: 0,
        tween: {
            targets: [assisting],
            x: sourceX,
            y: sourceY
        }
    }];

    return timelineData;
};

export default RepositionAssist;
