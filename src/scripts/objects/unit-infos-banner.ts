import renderText from "../utils/renderText";
import Hero from "./hero";

class UnitInfosBanner extends Phaser.GameObjects.Container {
    private heroName: Phaser.GameObjects.Text;
    private weaponType: Phaser.GameObjects.Image;
    private hp: Phaser.GameObjects.Text; // to replace with images
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
        this.heroName = renderText(scene, blockX, 10, "", { fontSize: "26px" });
        this.heroPortrait = new Phaser.GameObjects.Image(scene, 0, 0, "").setOrigin(0, 0).setScale(0.5);
        this.weaponType = new Phaser.GameObjects.Image(scene, this.heroName.getLeftCenter().x - 42, this.heroName.getCenter().y, "");
        this.hp = renderText(scene, blockX - 53, 50, "", { fontSize: "18px" });

        const lvText = renderText(scene, 594, 26, "40+", { fontSize: "20px"});

        this.atk = renderText(scene, blockX + 20, 75, "", { fontSize: "18px" }).setOrigin(1, 0);
        this.spd = renderText(scene, blockX + 100, 75, "", { fontSize: "18px" }).setOrigin(1, 0);
        this.def = renderText(scene, blockX + 20, 100, "", { fontSize: "18px" }).setOrigin(1, 0);
        this.res = renderText(scene, blockX + 100, 100, "", { fontSize: "18px" }).setOrigin(1, 0);
        
        this.add([this.heroName, this.weaponType, this.heroPortrait, this.atk, this.spd, this.def, this.res, this.hp]);

        this.add(renderText(scene, blockX - 53, 75, "Atk", { fontSize: "18px" }));
        this.add(renderText(scene, blockX + 25, 75, "Spd", { fontSize: "18px" }));
        this.add(renderText(scene, blockX - 53, 100, "Def", { fontSize: "18px" }));
        this.add(renderText(scene, blockX + 25, 100, "Res", { fontSize: "18px" }));

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

    setHero(hero: Hero) {
        this.heroPortrait.setTexture(`${hero.name} battle`);
        this.hp.setText(`HP        ${hero.HP}/${hero.maxHP}`);
        if (this.heroName.text !== hero.name) {
            this.heroPortrait.x = -300;
            this.scene.tweens.add({
              targets: this.heroPortrait,
              x: 0,
              duration: 200
            });
        }
        this.heroName.setText(hero.name);
        for (let stat of ["atk", "def", "res", "spd"]) {
            this[stat].setText(hero.stats[stat].toString());
        }
        this.weaponType.setTexture(hero.unitData.weaponType);
    }
};

export default UnitInfosBanner;
