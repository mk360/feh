import renderText from "../utils/renderText";
import Hero from "./hero";
import TextColors from "../utils/text-colors";

class UnitInfosBanner extends Phaser.GameObjects.Container {
    private heroName: Phaser.GameObjects.Text;
    private weaponType: Phaser.GameObjects.Image;
    private hp: Phaser.GameObjects.Text; // to replace with images
    private atk: Phaser.GameObjects.Text;
    private def: Phaser.GameObjects.Text;
    private res: Phaser.GameObjects.Text;
    private weaponName: Phaser.GameObjects.Text;
    private spd: Phaser.GameObjects.Text;
    private weapon: Phaser.GameObjects.Text;
    private assist: Phaser.GameObjects.Text;
    private special: Phaser.GameObjects.Text;
    private slot_A: Phaser.GameObjects.Image;
    private slot_B: Phaser.GameObjects.Image;
    private slot_C: Phaser.GameObjects.Image;
    private maxHP: Phaser.GameObjects.Text;
    private slot_S: Phaser.GameObjects.Image;
    private heroPortrait: Phaser.GameObjects.Image;
    
    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        const blockX = 210;
        this.heroPortrait = new Phaser.GameObjects.Image(scene, 0, 0, "").setOrigin(0, 0).setScale(0.5);
        this.weaponType = new Phaser.GameObjects.Image(scene, blockX - 50, 25, "");
        this.hp = renderText(scene, blockX - 53, 50, "", { fontSize: "20px" });
        const gradient = this.hp.context.createLinearGradient(0, 0, 0, this.hp.height);
        gradient.addColorStop(0, "#FFFFFF");
        gradient.addColorStop(1, TextColors.healthyHP);
        this.hp.setFill(gradient);
        this.maxHP = renderText(scene, blockX - 46, 50, "", {
            fontSize: "18px"
        });
        const nameplate = new Phaser.GameObjects.Image(this.scene, this.weaponType.getLeftCenter().x, this.weaponType.getRightCenter().y, "nameplate").setScale(0.9, 0.5).setOrigin(0, 0.5);
        this.heroName = renderText(scene, nameplate.getCenter().x, nameplate.getCenter().y, "", { fontSize: "22px" }).setOrigin(0.5);
        const lvText = renderText(scene, 490, 15, "40+", { fontSize: "20px"});

        this.atk = renderText(scene, blockX + 20, 75, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers);
        this.spd = renderText(scene, blockX + 100, 75, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers);
        this.def = renderText(scene, blockX + 20, 100, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers);
        this.res = renderText(scene, blockX + 100, 100, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers);
        this.add(this.heroPortrait);
        const a = new Phaser.GameObjects.Image(this.scene, 20, -40, "unit-bg").setOrigin(0, 0);
        a.setDisplaySize(800, 430);
        this.add([a, nameplate]);
        
        this.add([this.heroName, this.weaponType, this.atk, this.spd, this.def, this.res, this.hp]);

        this.add(renderText(scene, blockX - 53, 75, "Atk", { fontSize: "18px" }));
        this.add(renderText(scene, blockX + 25, 75, "Spd", { fontSize: "18px" }));
        this.add(renderText(scene, blockX - 53, 100, "Def", { fontSize: "18px" }));
        this.add(renderText(scene, blockX + 25, 100, "Res", { fontSize: "18px" }));

        this.add(renderText(scene, lvText.getLeftCenter().x, 0, "Lv.", { fontSize: "14px"}));
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
        const weaponBg = new Phaser.GameObjects.Image(this.scene, 490, 45, "weapon-bg").setOrigin(0, 0).setScale(0.23, 0.25);
        const assistBg = new Phaser.GameObjects.Image(this.scene, 490, 85, "weapon-bg").setOrigin(0, 0).setScale(0.23, 0.25);
        const specialBg = new Phaser.GameObjects.Image(this.scene, 490, 125, "weapon-bg").setOrigin(0, 0).setScale(0.23, 0.25);
        const assistIcon = new Phaser.GameObjects.Image(this.scene, 490, 105, "assist-icon").setScale(0.45).setOrigin(0.25, 0.5);
        const specialIcon = new Phaser.GameObjects.Image(this.scene, 490, 135, "special-icon").setScale(0.45).setOrigin(0.25, 0.5);
        this.add(weaponBg);
        // this.add(assistBg);
        // this.add(specialBg);
        // this.add(assistIcon);
        // this.add(specialIcon);
        this.weaponName = renderText(this.scene, weaponBg.getLeftCenter().x + 30, weaponBg.getCenter().y, "").setOrigin(0, 0.5).setStyle({
            fontSize: "19px"
        });
        this.add(this.weaponName);
        this.add(new Phaser.GameObjects.Image(this.scene, 490, weaponBg.getLeftCenter().y, "weapon-icon").setScale(0.45).setOrigin(0.25, 0.5));
    }

    setHero(hero: Hero) {
        this.heroPortrait.setTexture(`${hero.name} battle`);
        this.hp.setText(`HP        ${hero.HP}/${hero.maxHP}`);
        if (this.heroName.text !== hero.name) {
            this.heroPortrait.x = -300;
            this.scene.tweens.add({
              targets: this.heroPortrait,
              x: -50,
              duration: 200
            });
        }
        this.heroName.setText(hero.name);
        for (let stat of ["atk", "def", "res", "spd"]) {
            this[stat].setText(hero.stats[stat].toString());
        }
        this.weaponType.setTexture(hero.unitData.weaponType);
        this.weaponName.setText(hero.weaponName);
    }
};

export default UnitInfosBanner;
