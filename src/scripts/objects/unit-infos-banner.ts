import renderText from "../utils/renderText";
import Hero from "./hero";

class UnitInfosBanner extends Phaser.GameObjects.Container {
    private highlightedHero: Hero = null;
    private heroName: Phaser.GameObjects.Text;
    private weaponType: Phaser.GameObjects.Image;
    private maxHP: Phaser.GameObjects.Text; // to replace with images
    private currentHP: Phaser.GameObjects.Text; // to replace with images
    private atk: Phaser.GameObjects.Text;
    private def: Phaser.GameObjects.Text;
    private res: Phaser.GameObjects.Text;
    private spd: Phaser.GameObjects.Text;
    private weapon: Phaser.GameObjects.Text;
    private assist: Phaser.GameObjects.Text;
    private special: Phaser.GameObjects.Text;
    private slot_A: Phaser.GameObjects.Image;
    private slot_B: Phaser.GameObjects.Image;
    private slot_C: Phaser.GameObjects.Image;
    private slot_S: Phaser.GameObjects.Image;
    private heroPortrait: Phaser.GameObjects.Image;
    
    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        const blockX = 310;
        this.heroName = renderText(scene, blockX, 10, "Dimitri", { fontSize: "26px" });
        this.heroPortrait = new Phaser.GameObjects.Image(scene, 0, 0, "dimitri battle").setOrigin(0, 0).setScale(0.5);
        this.weaponType = new Phaser.GameObjects.Image(scene, this.heroName.getLeftCenter().x - 42, this.heroName.getCenter().y, "lance");
        this.atk = new Phaser.GameObjects.Text(scene, 100, 70, "49", {});
        this.add([this.heroName, this.weaponType, this.heroPortrait, this.atk]);
        this.add(renderText(scene, blockX - 53, 50, "PV         47 / 47", { fontSize: "18px" }))
        this.add(renderText(scene, blockX - 53, 75, "Atk", { fontSize: "18px" }));
        this.add(renderText(scene, blockX - 13, 75, "57", { fontSize: "18px" }));
        this.add(renderText(scene, blockX + 20, 75, "Spd", { fontSize: "18px" }));
        this.add(renderText(scene, blockX + 60, 75, "43", { fontSize: "18px" }));
        this.add(renderText(scene, blockX - 53, 100, "Def", { fontSize: "18px" }));
        this.add(renderText(scene, blockX - 13, 100, "30", { fontSize: "18px" }));
        this.add(renderText(scene, blockX + 20, 100, "Res", { fontSize: "18px" }));
        this.add(renderText(scene, blockX + 60, 100, "19", { fontSize: "18px" }));
    }

    // update() {
    //     if (this.highlightedHero) {
    //         this.setVisible(true);
    //     } else {
    //         this.setVisible(false);
    //     }
    // }

    private setHeroArt(name: string, damaged?: boolean) {

    }
};

export default UnitInfosBanner;
