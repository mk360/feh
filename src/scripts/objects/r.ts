import { GameObjects, Scene } from "phaser";

class R extends GameObjects.Container {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
        this.add(new GameObjects.Rectangle(scene, 0, 0, 300, 400, 0x45EA20).setOrigin(1, 0).setAlpha(0.6));
    }
};

export default R;
