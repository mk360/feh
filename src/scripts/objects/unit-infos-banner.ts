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
        this.heroName = renderText(scene, 360, 60, "Dimitri", { fontSize: "24px" })
        // this.heroName = new Phaser.GameObjects.Text(scene, 360, 60, "Dimitri", {
        //     fontSize: "24px",
        //     fontFamily: "FEH"
        // });
        this.heroPortrait = new Phaser.GameObjects.Image(scene, 0, 0, "dimitri battle").setOrigin(0, 0).setScale(0.5);
        this.weaponType = new Phaser.GameObjects.Image(scene, 340, 70, "lance");
        this.atk = new Phaser.GameObjects.Text(scene, 100, 70, "49", {});
        this.add([this.heroName, this.weaponType, this.heroPortrait, this.atk]);
        this.add(renderText(scene, 500, 60, "Atk", { fontSize: "20px" }));
        this.add(renderText(scene, 540, 60, "64", { fontSize: "20px" }));
        this.add(renderText(scene, 570, 60, "Spd", { fontSize: "20px" }));
        this.add(renderText(scene, 610, 60, "20", { fontSize: "20px" }));
        this.add(renderText(scene, 500, 90, "Def", { fontSize: "20px" }));
        this.add(renderText(scene, 540, 90, "30", { fontSize: "20px" }));
        this.add(renderText(scene, 570, 90, "Res", { fontSize: "20px" }));
        this.add(renderText(scene, 610, 90, "19", { fontSize: "20px" }));
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
