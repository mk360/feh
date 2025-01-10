import { Types } from "phaser";
import toCoords from "../../../utils/to-coords";
import Hero from "../../objects/hero";
import MainScene from "../../scenes/mainScene";
import { gridToPixels } from "../../utils/grid-functions";

function PivotAssist(scene: MainScene, assisting: Hero, assisted: Hero, sourceHeroCoordinates: string, targetHeroCoordinates: string) {
    const { x: sourceX, y: sourceY } = toCoords(sourceHeroCoordinates);
    console.log(sourceHeroCoordinates, targetHeroCoordinates)
    const { x: targetX, y: targetY } = toCoords(targetHeroCoordinates);
    const pxSourceCoords = gridToPixels(sourceX, sourceY);

    const timelineData: Types.Time.TimelineEventConfig[] = [{
        from: 0,
        tween: {
            targets: [assisting],
            x: pxSourceCoords.x,
            y: pxSourceCoords.y,
            duration: 100,
        }
    }];

    return timelineData;
};

export default PivotAssist;
