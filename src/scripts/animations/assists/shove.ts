import { Math, Tweens, Types } from "phaser";
import Hero from "../../objects/hero";
import MainScene from "../../scenes/mainScene";
import { gridToPixels } from "../../utils/grid-functions";
import toCoords from "../../../utils/to-coords";

function ShoveAssist(scene: MainScene, assisting: Hero, assisted: Hero, sourceHeroCoordinates: string, targetHeroCoordinates: string) {
    const { x: targetX, y: targetY } = toCoords(targetHeroCoordinates);
    const targetCoordinates = gridToPixels(targetX, targetY);
    const timelineData: Types.Time.TimelineEventConfig[] = [{
        from: 0,
        tween: {
            targets: [assisting],
            x: assisted.x,
            y: assisted.y,
            yoyo: true,
            duration: 500,
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
