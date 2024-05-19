import { GameObjects, Scene } from "phaser";
import { renderText } from "../utils/text-renderer";

interface HeroInformations {
    name: string;
    weaponType: string;
    weaponColor: string;
    tapCallbacks: {
        name: (boundObject: GameObjects.Text) => void;
        weaponType: (boundObject: GameObjects.Image) => void;
    }
};

class HeroNameplate extends GameObjects.Container {
    weaponIcon: GameObjects.Image;
    heroName: GameObjects.Text;
    nameplate: GameObjects.Image;

    constructor(scene: Scene, x: number, y: number, informations: HeroInformations) {
        super(scene, x, y);
        this.nameplate = new GameObjects.Image(scene, 0, 0, "top-banner", "nameplate").setScale(0.7, 0.45).setOrigin(0, 0.5);
        this.weaponIcon = new GameObjects.Image(scene, this.nameplate.getLeftCenter().x + 22, this.nameplate.getLeftCenter().y, "weapons", `${informations.weaponColor}-${informations.weaponType}`).setScale(1.1).setInteractive().on("pointerdown", function (this: GameObjects.Image) {
            informations.tapCallbacks.weaponType(this);
        });
        this.heroName = renderText(scene, this.nameplate.getCenter().x, this.nameplate.getCenter().y, informations.name, { fontSize: "19px" }).setOrigin(0.5).setInteractive();
        this.heroName.on("pointerdown", function (this: GameObjects.Text) {
            informations.tapCallbacks.name(this);
        });
        this.add([this.nameplate, this.weaponIcon, this.heroName]);
    }

    updateNameplate({ name, weaponType, weaponColor }: { name: string; weaponType: string; weaponColor: string }) {
        this.heroName.setText(name);
        this.weaponIcon.setFrame(`${weaponColor}-${weaponType}`);
    }
};

export default HeroNameplate;
