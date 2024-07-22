import { GameObjects, Scene } from "phaser";
import { renderText } from "../utils/text-renderer";

class Button extends GameObjects.Container {
    private label: GameObjects.Text;

    constructor(scene: Scene, label: string) {
        super(scene);
        const button = new GameObjects.Image(scene, 0, 0, "ui-button").setScale(0.9);
        this.label = renderText(scene, -30, -35, label, {
            fontSize: 20
        });
        this.setSize(120, 120).setInteractive();
        this.add(button);
        this.add(this.label);
        this.label.setWordWrapWidth(90, true);
        this.on("pointerdown", () => {
            button.setTexture("ui-button-pressed");
            this.label.x += 5;
            this.label.y += 10;
        });
        this.on("pointerup", () => {
            button.setTexture("ui-button");
            this.label.x -= 5;
            this.label.y -= 10;
        });
    }

    setLabel(newText: string) {
        this.label.setText(newText);
    }
};

export default Button;
