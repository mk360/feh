import { GameObjects, Scene } from "phaser";
import RotatingIconsImage from "../../interfaces/rotating-icons";

class IconsSwitcher extends GameObjects.Image implements RotatingIconsImage {
    iconsList: string[];
    private iconIndex = 0;

    constructor(scene: Scene, x: number, y: number, textures: string[]) {
        super(scene, x, y, "");
        this.iconsList = textures;
        this.setVisible(!!this.iconsList.length);
    }

    toggleIcons() {
        if (this.iconIndex + 1 === this.iconsList.length) {
            this.iconIndex = 0;
        } else {
            this.iconIndex++;
        }

        this.setTexture(this.iconsList[this.iconIndex]);
        this.setVisible(!!this.iconsList.length);
        return this;
    }

    setIcons(icons: string[]) {
        this.iconsList = icons;
        return this;
    }
};

export default IconsSwitcher;
