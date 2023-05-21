import { GameObjects, Scene } from "phaser";

class HeroPortrait extends GameObjects.Image {
    constructor(scene: Scene, unit: string) {
        super(scene, -100, -10, `${unit} battle`);
        this.setOrigin(0);
    }
};

export default HeroPortrait;
