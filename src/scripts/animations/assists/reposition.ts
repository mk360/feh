import { Types } from "phaser";
import { gridToPixels } from "../../utils/grid-functions";
import MainScene from "../../scenes/mainScene";
import Hero from "../../objects/hero";
import toCoords from "../../../utils/to-coords";

function RepositionAssist(scene: MainScene, assisting: Hero, assisted: Hero, sourceHeroCoordinates: string, targetHeroCoordinates: string) {
    const { x: targetX, y: targetY } = toCoords(sourceHeroCoordinates);
    const { x: sourceX, y: sourceY } = toCoords(targetHeroCoordinates);
    const pxTargetCoords = gridToPixels(targetX, targetY);
    const pxSourceCoords = gridToPixels(sourceX, sourceY);


    const timelineData: Types.Time.TimelineEventConfig[] = [
        {
            from: 0,
            tween: {
                targets: [assisting],
                x: pxTargetCoords.x,
                y: pxTargetCoords.y,
                duration: 100,
            }
        },
        {
            from: 100,
            tween: {
                targets: [assisted],
                x: pxSourceCoords.x,
                y: pxSourceCoords.y,
                duration: 100,
            }
        }
    ];

    return timelineData;
};

export default RepositionAssist;
