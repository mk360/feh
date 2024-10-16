import { GameObjects, Scene } from "phaser";
import Button from "./button";

const yPosition = 0;
const xPadding = 10;
const spacing = 100;

class ActionsTray extends GameObjects.Container {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
    }

    addAction(action: Button, fn: () => void) {
        action.x = spacing * this.list.length + xPadding;
        action.y = yPosition;
        action.addAction(fn);
        this.add(action);
        return this;
    }
};

export default ActionsTray;
