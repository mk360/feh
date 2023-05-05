import { GameObjects, Scene } from "phaser";

class HeroPortrait extends GameObjects.Sprite {
    constructor(scene: Scene, unit: string) {
        super(scene, -30, 0, `${unit} battle`);
        this.setOrigin(0);
        this.setScale(0.5);
    }
};

export default HeroPortrait;
