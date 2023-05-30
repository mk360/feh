import { GameObjects, Scene } from "phaser";

abstract class Textbox extends GameObjects.Container {
    private contentContainer: GameObjects.Rectangle;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
        this.contentContainer = new GameObjects.Rectangle(scene, 0, 0, 400, 400, 0x13353F).setOrigin(1, 0).setAlpha(0.9).setStrokeStyle(2, 0x7FD2E0);
        this.add(this.contentContainer);
    }

    abstract setContent(contentLines: GameObjects.Text[][]): Textbox;
}

export default Textbox;
