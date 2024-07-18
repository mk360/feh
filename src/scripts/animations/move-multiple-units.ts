import { Time } from "phaser";
import MainScene from "../scenes/mainScene";
import Hero from "../objects/hero";
import { gridToPixels } from "../utils/grid-functions";

function MoveMultipleUnits(scene: MainScene, config: {
    target: string;
    coords: { x: number; y: number }
}[]) {
    const mappedToObjects = config.map((value) => {
        const targetHero = scene.children.getByName(value.target) as Hero;
        return {
            target: targetHero,
            coords: value.coords
        };
    });

    const timeline = new Time.Timeline(scene, config.map((value) => {
        const { x: pX, y: pY } = gridToPixels(value.coords.x, value.coords.y);
        return {
            from: 0,
            tween: {
                targets: [scene.children.getByName(value.target) as Hero],
                x: pX,
                y: pY
            }
        }
    }));

    return timeline;
};

export default MoveMultipleUnits;
