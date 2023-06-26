import { GameObjects, Scene } from "phaser";
import Button from "./button";

const buttonsSpacing = 130;
const yPosition = 1250;
const xPadding = 70;

class ActionsTray extends GameObjects.Group {
    constructor(scene: Scene) {
        super(scene);
    }

    addAction(action: Button) {
        action.x = this.getLength() * buttonsSpacing + xPadding;
        action.y = yPosition;
        this.add(action, true);
        return this;
    }
};

export default ActionsTray;
