import { GameObjects, Scene } from "phaser";
import Button from "./button";

const buttonsSpacing = 0;
const yPosition = 0;
const xPadding = 70;

class ActionsTray extends GameObjects.Container {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
    }

    addAction(action: Button) {
        action.x = 20 * buttonsSpacing + xPadding;
        action.y = yPosition;
        this.add(action);
        return this;
    }
};

export default ActionsTray;
