import { GameObjects, Scene } from "phaser";
import { renderText } from "../utils/text-renderer";

class Button extends GameObjects.Container {
    private label: GameObjects.Text;
    private boundsArea: GameObjects.Rectangle;

    constructor(scene: Scene, label: string) {
        super(scene);
        const buttonImage = new GameObjects.Image(scene, 0, 0, "ui-button").setScale(0.70);
        buttonImage.setOrigin(0);
        this.boundsArea = new GameObjects.Rectangle(scene, buttonImage.getCenter().x, buttonImage.getCenter().y, buttonImage.displayWidth * 0.75, buttonImage.displayHeight * 0.75, 0xFF0000, 0);
        this.boundsArea.setInteractive();
        this.label = renderText({
            scene,
            x: buttonImage.getCenter().x,
            y: buttonImage.getCenter().y,
            content: label,
            style: {
                fontSize: 16
            }
        }).setOrigin(0.5);
        this.add(buttonImage);
        this.add(this.label);
        this.add(this.boundsArea);
        this.setSize(100, 100).setInteractive();
        this.label.setWordWrapWidth(60);
    }

    addAction(fn: () => void) {
        this.boundsArea.on("pointerup", fn);
    }

    setLabel(newText: string) {
        this.label.setText(newText);
    }
};

export default Button;
