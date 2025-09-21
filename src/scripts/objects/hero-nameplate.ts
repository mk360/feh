import { GameObjects, Scene } from "phaser";
import { renderText } from "../utils/text-renderer";

interface HeroInformations {
    name: string;
    weaponType: string;
    weaponColor: string;
    rarity: number;
    ally: boolean;
};

interface NameplateInit extends HeroInformations {
    tapCallbacks: {
        name: (boundObject: GameObjects.Text) => void;
        weaponType: (boundObject: GameObjects.Image) => void;
    };
}

class HeroNameplate extends GameObjects.Container {
    weaponIcon: GameObjects.Image;
    heroName: GameObjects.Text;
    nameplateBackground: GameObjects.Image;
    nameplate: GameObjects.Image;

    constructor(scene: Scene, x: number, y: number, informations: NameplateInit) {
        super(scene, x, y);
        this.nameplate = new GameObjects.Image(scene, 0, 0, "unit-summary", `${informations.rarity}-star-plate`).setOrigin(0, 0.5).setScale(1.05, 1);
        this.nameplateBackground = new GameObjects.Image(scene, 0, 0, "unit-summary", "ally-plate").setOrigin(0, 0.5).setScale(1.05, 1);
        this.weaponIcon = new GameObjects.Image(scene, this.nameplate.getLeftCenter().x + 22, this.nameplate.getLeftCenter().y, "weapons", `${informations.weaponColor}-${informations.weaponType}`).setInteractive().on("pointerdown", function (this: GameObjects.Image) {
            informations.tapCallbacks.weaponType(this);
        });
        this.heroName = renderText({
            scene,
            x: this.nameplate.getCenter().x,
            y: this.nameplate.getCenter().y,
            content: informations.name,
            style: { fontSize: "19px" }
        }).setOrigin(0.5).setInteractive();
        this.heroName.on("pointerdown", function (this: GameObjects.Text) {
            informations.tapCallbacks.name(this);
        });
        this.add([this.nameplateBackground, this.nameplate, this.weaponIcon, this.heroName]);
    }

    updateNameplate({ name, weaponType, weaponColor, ally }: HeroInformations) {
        this.heroName.setText(name);
        this.weaponIcon.setFrame(`${weaponColor}-${weaponType}`);
        if (ally) {
            this.nameplateBackground.setFrame("ally-plate");
        } else {
            this.nameplateBackground.setFrame("enemy-plate");
        }
    }
};

export default HeroNameplate;
