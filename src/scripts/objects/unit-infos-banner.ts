import { renderCritHPText, renderRegularHPText, renderText } from "../utils/text-renderer";
import Hero from "./hero";
import TextColors from "../utils/text-colors";
import HeroNameplate from "./hero-nameplate";
import { GameObjects } from "phaser";

class UnitInfosBanner extends GameObjects.Container {
    private hp: GameObjects.Text; // to replace with images
    private atk: GameObjects.Text;
    private def: GameObjects.Text;
    private nameplate: HeroNameplate;
    private res: GameObjects.Text;
    private weaponName: GameObjects.Text;
    private spd: GameObjects.Text;
    private currentHP: GameObjects.Text;
    private assist: GameObjects.Text;
    private special: GameObjects.Text;
    private slot_A: GameObjects.Image;
    private slot_B: GameObjects.Image;
    private slot_C: GameObjects.Image;
    private maxHP: GameObjects.Text;
    private slot_S: GameObjects.Image;
    private heroPortrait: GameObjects.Image;
    
    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        const blockX = 310;
        this.heroPortrait = new GameObjects.Image(scene, 0, 0, "").setOrigin(0, 0).setScale(0.5);
        this.add(this.heroPortrait);
        const a = new GameObjects.Image(this.scene, 20, -40, "unit-bg").setOrigin(0, 0);
        a.setDisplaySize(800, 430);
        this.add(a);
        this.add(new GameObjects.Image(scene, blockX - 140, 70, "hp plate").setScale(1.15, 0.6).setOrigin(0, 0.5));
        this.hp = renderText(scene, blockX - 120, 54, "HP", { fontSize: "20px" });
        this.maxHP = renderRegularHPText({
            scene: this.scene,
            x: blockX,
            y: 56,
            content: "",
            style: {
                fontSize: "18px"
            }
        });

        this.nameplate = new HeroNameplate(scene, blockX - 150, 25, {
            name: "",
            weaponType: "",
        });

        const lvText = renderText(scene, 590, 15, "40+", { fontSize: "20px"});

        this.atk = renderText(scene, blockX - 30, 89, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers);
        this.spd = renderText(scene, blockX + 80, 89, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers);
        this.def = renderText(scene, blockX - 30, 114, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers);
        this.res = renderText(scene, blockX + 80, 114, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers);
        this.add([this.nameplate]);
        
        this.add([this.atk, this.spd, this.def, this.res, this.hp]);

        this.add(new GameObjects.Image(scene, blockX - 130, 111, "stat-line").setScale(0.2, 0.5).setOrigin(0));
        this.add(new GameObjects.Image(scene, blockX - 130, 136, "stat-line").setScale(0.2, 0.5).setOrigin(0));

        this.add(renderText(scene, blockX - 120, 89, "Atk", { fontSize: "18px" }));
        this.add(renderText(scene, blockX - 10, 89, "Spd", { fontSize: "18px" }));
        this.add(renderText(scene, blockX - 120, 114, "Def", { fontSize: "18px" }));
        this.add(renderText(scene, blockX - 10, 114, "Res", { fontSize: "18px" }));

        this.add(renderText(scene, lvText.getLeftCenter().x, 0, "Lv.", { fontSize: "14px"}));
        this.add(lvText);
        const S_Skill = new GameObjects.Image(scene, 715, lvText.getBottomCenter().y, "empty-skill").setScale(0.5).setOrigin(0, 1);
        const S_Letter = new GameObjects.Image(scene, S_Skill.getBottomRight().x, S_Skill.getBottomRight().y, "S").setOrigin(1).setScale(0.5);
        this.add(S_Skill);
        this.add(S_Letter);
        const C_Skill = new GameObjects.Image(scene, 690, lvText.getBottomCenter().y, "empty-skill").setScale(0.5).setOrigin(0, 1);
        const C_Letter = new GameObjects.Image(scene, C_Skill.getBottomRight().x, C_Skill.getBottomRight().y, "C").setOrigin(1).setScale(0.5);
        this.add(C_Skill);
        this.add(C_Letter);
        const B_Skill = new GameObjects.Image(scene, 665, lvText.getBottomCenter().y, "empty-skill").setScale(0.5).setOrigin(0, 1);
        const B_Letter = new GameObjects.Image(scene, B_Skill.getBottomRight().x, B_Skill.getBottomRight().y, "B").setOrigin(1).setScale(0.5);
        this.add(B_Skill);
        this.add(B_Letter);
        const A_Skill = new GameObjects.Image(scene, 640, lvText.getBottomCenter().y, "empty-skill").setScale(0.5).setOrigin(0, 1);
        const A_Letter = new GameObjects.Image(scene, A_Skill.getBottomRight().x, A_Skill.getBottomRight().y, "A").setOrigin(1).setScale(0.5);
        this.add(A_Skill);
        this.add(A_Letter);
        const weaponBg = new GameObjects.Image(this.scene, 490, 45, "weapon-bg").setOrigin(0, 0).setScale(0.23, 0.25);
        const assistBg = new GameObjects.Image(this.scene, 490, 85, "weapon-bg").setOrigin(0, 0).setScale(0.23, 0.25);
        const specialBg = new GameObjects.Image(this.scene, 490, 125, "weapon-bg").setOrigin(0, 0).setScale(0.23, 0.25);
        const assistIcon = new GameObjects.Image(this.scene, 490, 105, "assist-icon").setScale(0.45).setOrigin(0.25, 0.5);
        const specialIcon = new GameObjects.Image(this.scene, 490, 135, "special-icon").setScale(0.45).setOrigin(0.25, 0.5);
        this.add(weaponBg);
        // this.add(assistBg);
        // this.add(specialBg);
        // this.add(assistIcon);
        // this.add(specialIcon);
        this.weaponName = renderText(this.scene, weaponBg.getLeftCenter().x + 30, weaponBg.getCenter().y, "").setOrigin(0, 0.5).setStyle({
            fontSize: "19px"
        });
        this.add(this.weaponName);
        this.add(new GameObjects.Image(this.scene, 490, weaponBg.getLeftCenter().y, "weapon-icon").setScale(0.45).setOrigin(0.25, 0.5));
        this.currentHP = renderRegularHPText({
            scene: this.scene,
            x: blockX - 60,
            y: 50,
            content: 0,
            style: {
                fontSize: "26px"
            }
        });
        this.add(this.currentHP);
        this.add(this.maxHP);
    }

    setHero(hero: Hero) {
        this.heroPortrait.setTexture(`${hero.name} battle`);
        this.currentHP.destroy();
        const hpRenderFct = hero.getInternalHero().stats.hp < 10 ? renderCritHPText : renderRegularHPText;
        this.currentHP = hpRenderFct({
            scene: this.scene,
            x: this.currentHP.x,
            y: this.currentHP.y,
            style: {
                fontSize: "26px",
            },
            content: hero.getInternalHero().stats.hp,
        });
        this.add(this.currentHP);
        if (this.nameplate.heroName.text !== hero.name) {
            this.heroPortrait.x = -300;
            this.scene.tweens.add({
              targets: this.heroPortrait,
              x: -50,
              duration: 200
            });
        }
        this.nameplate.updateNameplate({
            name: hero.getInternalHero().name,
            weaponType: hero.getInternalHero().getWeapon().type
        });
        this.maxHP.setText(`/ ${hero.getInternalHero().maxHP}`);

        for (let stat of ["atk", "def", "res", "spd"]) {
            this[stat].setText(hero.getInternalHero().stats[stat].toString());
        }

        this.weaponName.setText(hero.getInternalHero().getWeapon().name);
    }
};

export default UnitInfosBanner;
