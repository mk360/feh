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
        this.add(renderText(scene, blockX - 53, 50, "PV       47 / 47", { fontSize: "18px" }))
        this.add(renderText(scene, blockX - 53, 75, "Atk", { fontSize: "18px" }));
        this.add(renderText(scene, blockX - 13, 75, "57", { fontSize: "18px" }));
        this.add(renderText(scene, blockX + 20, 75, "Spd", { fontSize: "18px" }));
        this.add(renderText(scene, blockX + 60, 75, "43", { fontSize: "18px" }));
        this.add(renderText(scene, blockX - 53, 100, "Def", { fontSize: "18px" }));
        this.add(renderText(scene, blockX - 13, 100, "30", { fontSize: "18px" }));
        this.add(renderText(scene, blockX + 20, 100, "Res", { fontSize: "18px" }));
        this.add(renderText(scene, blockX + 60, 100, "19", { fontSize: "18px" }));
        var lvText = renderText(scene, 594, 26, "40+", { fontSize: "20px"});
        this.add(renderText(scene, lvText.getLeftCenter().x, 10, "Lv.", { fontSize: "14px"}));
        this.add(lvText);
        const S_Skill = new Phaser.GameObjects.Image(scene, 715, lvText.getBottomCenter().y, "empty-skill").setScale(0.5).setOrigin(0, 1);
        const S_Letter = new Phaser.GameObjects.Image(scene, S_Skill.getBottomRight().x, S_Skill.getBottomRight().y, "S").setOrigin(1).setScale(0.5);
        this.add(S_Skill);
        this.add(S_Letter);
        const C_Skill = new Phaser.GameObjects.Image(scene, 690, lvText.getBottomCenter().y, "empty-skill").setScale(0.5).setOrigin(0, 1);
        const C_Letter = new Phaser.GameObjects.Image(scene, C_Skill.getBottomRight().x, C_Skill.getBottomRight().y, "C").setOrigin(1).setScale(0.5);
        this.add(C_Skill);
        this.add(C_Letter);
        const B_Skill = new Phaser.GameObjects.Image(scene, 665, lvText.getBottomCenter().y, "empty-skill").setScale(0.5).setOrigin(0, 1);
        const B_Letter = new Phaser.GameObjects.Image(scene, B_Skill.getBottomRight().x, B_Skill.getBottomRight().y, "B").setOrigin(1).setScale(0.5);
        this.add(B_Skill);
        this.add(B_Letter);
        const A_Skill = new Phaser.GameObjects.Image(scene, 640, lvText.getBottomCenter().y, "empty-skill").setScale(0.5).setOrigin(0, 1);
        const A_Letter = new Phaser.GameObjects.Image(scene, A_Skill.getBottomRight().x, A_Skill.getBottomRight().y, "A").setOrigin(1).setScale(0.5);
        this.add(A_Skill);
        this.add(A_Letter);
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
