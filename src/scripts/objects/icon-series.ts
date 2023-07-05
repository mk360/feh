import { GameObjects, Scene } from "phaser";
import RotatingIconsImage from "../../interfaces/rotating-icons";

class IconsSwitcher extends GameObjects.Image implements RotatingIconsImage {
    iconsList: string[];
    constructor(scene: Scene, x: number, y: number, textures: string[]) {
        super(scene, x, y, "");
        this.iconsList = [];
    }

    toggleIcons(): void {
        
    }
}