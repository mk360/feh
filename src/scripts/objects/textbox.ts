import { GameObjects, Scene } from "phaser";

class Textbox extends GameObjects.Container {
    private contentContainer: GameObjects.Rectangle;
    private children: GameObjects.GameObject[] = [];

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
        this.contentContainer = new GameObjects.Rectangle(scene, 0, 0, 450, 500, 0x13353F).setOrigin(1, 0).setAlpha(0.9).setStrokeStyle(2, 0x7FD2E0).setOrigin(1, 0);
        this.add(this.contentContainer);
    }

    setContent(contentLines: GameObjects.Text[][]) {
        let padding = 10;
        let lowestHeight = 0;

        for (let line of contentLines) {
            for (let element of line) {
                this.add(element);
                this.children.push(element);
                element.y += padding + this.contentContainer.getTopCenter().y;
                element.x += padding + this.contentContainer.getLeftCenter().x;
                lowestHeight = Math.max(lowestHeight, element.getBottomCenter().y);
            }
        }

        this.contentContainer.setDisplaySize(this.contentContainer.displayWidth, lowestHeight + padding - this.contentContainer.getTopCenter().y);
        return this;
    };

    clearContent() {
        while (this.children.length) {
            this.remove(this.children.shift(), true);
        }
        return this;
    }
}

export default Textbox;
