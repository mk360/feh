import { GameObjects, Scene } from "phaser";
import { renderCritHPText, renderRegularHPText } from "./text-renderer";

function renderHP({
    scene,
    x,
    y,
    value,
    style
}: { scene: Scene, x: number, y: number, value: number, style: Partial<GameObjects.TextStyle>}) {
    if (value < 10) {
        return renderCritHPText({
            scene,
            x,
            y,
            content: value.toString(),
            style
        });
    }

    return renderRegularHPText({
        scene,
        x,
        y,
        content: value.toString(),
        style
    });
};

export default renderHP;
