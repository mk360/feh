import { GameObjects, Scene } from "phaser";
import RotatingIconsImage from "../../interfaces/rotating-icons";

class IconsSwitcher extends GameObjects.Image implements RotatingIconsImage {
    iconsList: IconData[];
    private iconIndex = -1;

    constructor(scene: Scene, x: number, y: number, textures: IconData[]) {
        super(scene, x, y, "");
        this.iconsList = textures;
        this.setVisible(!!this.iconsList.length);
        this.toggleIcons();
    }

    toggleIcons() {
        if (this.iconIndex + 1 >= this.iconsList.length) {
            this.iconIndex = 0;
        } else {
            this.iconIndex++;
        }

        const iconData = this.iconsList[this.iconIndex];
        if (typeof iconData === "string") {
            this.setTexture(iconData);
            this.setFrame(null);
        } else if (iconData) {
            this.setTexture(iconData.texture);
            this.setFrame(iconData.frame);
        }

        this.setVisible(!!this.iconsList.length);
        return this;
    }

    setIcons(icons: string[]) {
        this.iconsList = icons;
        return this;
    }
};

export default IconsSwitcher;
