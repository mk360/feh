import { GameObjects, Scene } from "phaser";

class HeroPortrait extends GameObjects.Image {
    constructor(scene: Scene, x: number, unit: string) {
        super(scene, x, 0, `${unit} battle`);
        this.setOrigin(0);
    }
};

export default HeroPortrait;
