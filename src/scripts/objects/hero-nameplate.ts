import { GameObjects, Scene } from "phaser";
import { renderText } from "../utils/text-renderer";

interface HeroInformations {
    name: string;
    weaponType: string;
};

class HeroNameplate extends GameObjects.Container {
    weaponIcon: GameObjects.Image;
    heroName: GameObjects.Text;
    nameplate: GameObjects.Image;

    constructor(scene: Scene, x: number, y: number, informations: HeroInformations) {
        super(scene, x, y);
        this.nameplate = new GameObjects.Image(scene, 0, 0, "nameplate").setScale(0.9, 0.5).setOrigin(0, 0.5);
        this.weaponIcon = new GameObjects.Image(scene, this.nameplate.getLeftCenter().x + 22,this.nameplate.getLeftCenter().y, informations.weaponType).setScale(1.2);
        this.heroName = renderText(scene, this.nameplate.getCenter().x,this.nameplate.getCenter().y, informations.name, { fontSize: "22px" }).setOrigin(0.5);
        this.add([this.nameplate, this.weaponIcon, this.heroName]);
    }

    updateNameplate({ name, weaponType }: { name: string; weaponType: string }) {
        this.heroName.setText(name);
        this.weaponIcon.setTexture(weaponType);
    }
};

export default HeroNameplate;
