import { GameObjects, Scene } from "phaser";
import Button from "./button";

const buttonsSpacing = 0;
const yPosition = 0;
const xPadding = 30;

class ActionsTray extends GameObjects.Container {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
    }

    addAction(action: Button, fn: () => void) {
        action.x = 20 * buttonsSpacing + xPadding;
        action.y = yPosition;
        action.addAction(fn);
        this.add(action);
        return this;
    }
};

export default ActionsTray;
