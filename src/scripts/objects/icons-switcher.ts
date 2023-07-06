import { GameObjects, Scene } from "phaser";
import RotatingIconsImage from "../../interfaces/rotating-icons";

class IconsSwitcher extends GameObjects.Image implements RotatingIconsImage {
    iconsList: string[];
    private iconIndex = 0;

    constructor(scene: Scene, x: number, y: number, textures: string[]) {
        super(scene, x, y, "");
        this.iconsList = textures;
    }

    toggleIcons() {
        if (this.iconIndex + 1 === this.iconsList.length) {
            this.iconIndex = 0;
        } else {
            this.iconIndex++;
        }

        this.setFrame(this.iconsList[this.iconIndex]);
        return this;
    }

    setIcons(icons: string[]) {
        this.iconsList = icons;
        return this;
    }
};

export default IconsSwitcher;
