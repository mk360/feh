import { GameObjects, Scene } from "phaser";

type GenericGameObject = GameObjects.Components.Transform & GameObjects.Components.ComputedSize & GameObjects.Components.GetBounds & Phaser.Events.EventEmitter;
// all game objects typically have these components

class HighlightRectangle extends GameObjects.Rectangle {
    constructor(scene: Scene) {
        super(scene, 0, 0, 0, 0, 0xff0000);
        this.setOrigin(0);
        this
    };

    highlightElement(element: GenericGameObject) {
        this.x = element.getTopLeft().x;
        this.setAlpha(0.8);
        this.y = element.getTopLeft().y;
        this.width = element.width;
        this.height = element.height;
        this.setVisible(true);

        element.once("pointerup", () => {
            this.setAlpha(0.4);
        });
    }
};

export default HighlightRectangle;
