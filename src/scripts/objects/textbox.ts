import { GameObjects, Scene } from "phaser";

class Textbox extends GameObjects.Container {
    private contentContainer: GameObjects.Rectangle;
    private children: GameObjects.GameObject[] = [];

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
        this.contentContainer = new GameObjects.Rectangle(scene, 0, 0, 400, 400, 0x13353F).setOrigin(1, 0).setAlpha(0.9).setStrokeStyle(2, 0x7FD2E0);
        this.add(this.contentContainer);
    }

    setContent(contentLines: GameObjects.Text[][]) {
        let verticalPadding = 5;
        let lastElementY = 0;

        for (let line of contentLines) {
            for (let element of line) {
                this.add(element);
                this.children.push(element);
                element.y += verticalPadding + this.contentContainer.getTopCenter().y;
                element.x = 80;
                lastElementY = element.y;
            }
        }

        this.contentContainer.setDisplaySize(this.contentContainer.displayWidth, lastElementY + verticalPadding);
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
