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
    private maxHP: GameObjects.Text;
    private A: GameObjects.Image;
    private B: GameObjects.Image;
    private C: GameObjects.Image;
    private S: GameObjects.Image;
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
        this.S = new GameObjects.Image(scene, 715, lvText.getBottomCenter().y, "empty-skill").setScale(0.5).setOrigin(0, 1);
        const S_Letter = new GameObjects.Image(scene, this.S.getBottomRight().x, this.S.getBottomRight().y, "S").setOrigin(1).setScale(0.5);
        this.add(this.S);
        this.add(S_Letter);
        this.C = new GameObjects.Image(scene, 690, lvText.getBottomCenter().y, "empty-skill").setScale(0.5).setOrigin(0, 1);
        const C_Letter = new GameObjects.Image(scene, this.C.getBottomRight().x, this.C.getBottomRight().y, "C").setOrigin(1).setScale(0.5);
        this.add(this.C);
        this.add(C_Letter);
        this.B = new GameObjects.Image(scene, 665, lvText.getBottomCenter().y, "empty-skill").setScale(0.5).setOrigin(0, 1);
        const B_Letter = new GameObjects.Image(scene, this.B.getBottomRight().x, this.B.getBottomRight().y, "B").setOrigin(1).setScale(0.5);
        this.add(this.B);
        this.add(B_Letter);
        this.A = new GameObjects.Image(scene, 640, lvText.getBottomCenter().y, "empty-skill").setScale(0.5).setOrigin(0, 1);
        const A_Letter = new GameObjects.Image(scene, this.A.getBottomRight().x, this.A.getBottomRight().y, "A").setOrigin(1).setScale(0.5);
        this.add(this.A);
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
        const internalHero = hero.getInternalHero();
        this.heroPortrait.setTexture(`${internalHero.name} battle`);
        this.currentHP.destroy();
        const hpRenderFct = internalHero.stats.hp < 10 ? renderCritHPText : renderRegularHPText;
        this.currentHP = hpRenderFct({
            scene: this.scene,
            x: this.currentHP.x,
            y: this.currentHP.y,
            style: {
                fontSize: "26px",
            },
            content: internalHero.stats.hp,
        });
        this.add(this.currentHP);
        if (this.nameplate.heroName.text !== internalHero.name) {
            this.heroPortrait.x = -300;
            this.scene.tweens.add({
              targets: this.heroPortrait,
              x: -50,
              duration: 200
            });
        }
        this.nameplate.updateNameplate({
            name: internalHero.name,
            weaponType: internalHero.getWeapon().type
        });
        this.maxHP.setText(`/ ${internalHero.maxHP}`);

        for (let stat of ["atk", "def", "res", "spd"]) {
            this[stat].setText(internalHero.stats[stat].toString());
        }

        this.weaponName.setText(internalHero.getWeapon().name);

        for (let skill of ["A", "B", "C", "S"] as const) {
            if (internalHero.skills[skill]) {
                console.log(internalHero.skills[skill].name)
                this[skill].setTexture(internalHero.skills[skill].name);
            } else {
                this[skill].setTexture("empty-skill");
            }
        }
    }
};

export default UnitInfosBanner;
