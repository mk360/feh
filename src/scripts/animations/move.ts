import { Types } from "phaser";
import Hero from "../objects/hero";
import { gridToPixels } from "../utils/grid-functions";

function Move(target: Hero, targetCoordinates: { x: number; y: number }) {
    const timelineData: Types.Time.TimelineEventConfig[] = [];

    const targetPixels = gridToPixels(targetCoordinates.x, targetCoordinates.y);

    timelineData.push({
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
    });

    return timelineData;
};

export default Move;
