import { Types } from "phaser";
import Hero from "../../objects/hero";
import MainScene from "../../scenes/mainScene";
import { getTileCoordinates, gridToPixels } from "../../utils/grid-functions";

function DrawBack(scene: MainScene, args: string) {
    const movedUnits = args.match(/\(.+?\)/g).map((unit) => {
        const [id, from, to] = unit.replace(/[()]/g, "").split(" ");
        return {
            id,
            from: +from,
            to: +to,
        };
    });

    const timelineData: Types.Time.TimelineEventConfig[] = [];

    for (let movementData of movedUnits) {
        const unit = scene.heroesLayer.getByName(movementData.id) as Hero;
        const fromCoords = getTileCoordinates(movementData.from);
        const gridCell = gridToPixels(fromCoords.x, fromCoords.y);

        timelineData.push({
            from: 0,
            run() {
                unit.x = gridCell.x;
                unit.y = gridCell.y;
            }
        });
    }

    for (let i = 0; i < movedUnits.length; i++) {
        const movementData = movedUnits[i];
        const unit = scene.heroesLayer.getByName(movementData.id) as Hero;
        const toCoords = getTileCoordinates(movementData.to);
        const gridCell = gridToPixels(toCoords.x, toCoords.y);

        timelineData.push({
            from: i ? 0 : 100,
            tween: {
                targets: [unit],
                x: gridCell.x,
                y: gridCell.y,
                // ease: Math.Easing.Linear,
                duration: 100
            }
        });
    }

    return timelineData;
};

export default DrawBack;
