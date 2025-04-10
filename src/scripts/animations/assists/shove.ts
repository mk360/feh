import { Math, Types } from "phaser";
import toCoords from "../../../utils/to-coords";
import Hero from "../../objects/hero";
import MainScene from "../../scenes/mainScene";
import { gridToPixels } from "../../utils/grid-functions";

function ShoveAssist(scene: MainScene, assisting: Hero, assisted: Hero, sourceHeroCoordinates: string, targetHeroCoordinates: string) {
    const curCoordinates = assisting.getInternalHero().Position[0];
    const pxCoords = gridToPixels(curCoordinates.x, curCoordinates.y);

    const curAllyCoordinates = assisted.getInternalHero().Position[0];
    const pxAllyCoords = gridToPixels(curAllyCoordinates.x, curAllyCoordinates.y);
    const { x: targetX, y: targetY } = toCoords(sourceHeroCoordinates);
    const targetCoordinates = gridToPixels(targetX, targetY);
    const timelineData: Types.Time.TimelineEventConfig[] = [{
        from: 0,
        run() {
            assisting.x = pxCoords.x;
            assisting.y = pxCoords.y;
        }
    }, {
        from: 0,
        tween: {
            targets: [assisting],
            x: pxAllyCoords.x,
            y: pxAllyCoords.y,
            yoyo: true,
            duration: 100,
        }
    },
    {
        from: 250,
        tween: {
            targets: [assisted],
            x: targetCoordinates.x,
            y: targetCoordinates.y,
            duration: 250,
            ease: Math.Easing.Quadratic.Out,
        }
    }];
    return timelineData;
};

export default ShoveAssist;
