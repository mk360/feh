import { GameObjects, Scene } from "phaser";

class HeroPortrait extends GameObjects.Image {
    constructor(scene: Scene, x: number, unit: string) {
        super(scene, x, 0, `${unit} battle`);
        this.setOrigin(0);
    }

    setPortrait(name: string, hp: number, maxHP: number) {
        const damagedPortrait = hp / maxHP < 0.5;
        const frame = `portrait${damagedPortrait ? "-damage" : ""}`;
        this.setTexture(name, frame);
    }
};

export default HeroPortrait;
