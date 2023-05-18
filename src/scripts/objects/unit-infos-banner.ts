import { renderCritHPText, renderRegularHPText, renderText } from "../utils/text-renderer";
import Hero from "./hero";
import TextColors from "../utils/text-colors";
import HeroNameplate from "./hero-nameplate";
import { GameObjects } from "phaser";
import R from "./skill-details";

class UnitInfosBanner extends GameObjects.Container {
    private nameplate: HeroNameplate;
    private currentHP: GameObjects.Text;
    private maxHP: GameObjects.Text;
    private atk: GameObjects.Text;
    private def: GameObjects.Text;
    private res: GameObjects.Text;
    private weaponName: GameObjects.Text;
    private spd: GameObjects.Text;
    private A: GameObjects.Image;
    private B: GameObjects.Image;
    private C: GameObjects.Image;
    private S: GameObjects.Image;
    private heroPortrait: GameObjects.Image;
    private assist: GameObjects.Text;
    private special: GameObjects.Text;
    private skillDescContainer: GameObjects.Rectangle;
    private skillInfos: R;
    
    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        const blockX = 310;
        const canvas = scene.textures.createCanvas("gradient", 1500, 340);
        const ctx = canvas.getContext();
        const gradient = ctx.createLinearGradient(0, 0, 1500, 0);
        gradient.addColorStop(0, "#00CFF2");
        gradient.addColorStop(0.15, "#002B43");
        gradient.addColorStop(0.25, "#001D30");
        gradient.addColorStop(0.7, "#033554");
        // this.skillDescContainer = new GameObjects.Rectangle(scene, 0, 0, 600, 400, 0x13353F).setOrigin(1, 0).setAlpha(0.8).setStrokeStyle(2, 0x7FD2E0);
        // this.add(this.skillDescContainer);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1500, 400);
        this.add(new GameObjects.Image(scene, 0, 0, "gradient").setOrigin(0, 0.5));
        this.heroPortrait = new GameObjects.Image(scene, -100, -10, "").setOrigin(0);
        this.add(this.heroPortrait);
        this.add(new GameObjects.Image(scene, blockX - 140, 70, "hp plate").setScale(1.15, 0.6).setOrigin(0, 0.5));
        this.add(renderText(scene, blockX - 120, 54, "HP", { fontSize: "20px" }));
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
            weaponColor: "",
        });

        const lvText = renderText(scene, 590, 15, "40+", { fontSize: "20px"});

        this.atk = renderText(scene, blockX - 30, 89, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers);
        this.spd = renderText(scene, blockX + 80, 89, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers);
        this.def = renderText(scene, blockX - 30, 114, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers);
        this.res = renderText(scene, blockX + 80, 114, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers);
        this.add([this.nameplate]);
        
        this.add([this.atk, this.spd, this.def, this.res]);

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
        this.skillInfos = new R(scene, this.S.getCenter().x + 10, this.S.getBottomRight().y).setDepth(4).setVisible(false);
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
        this.add(this.skillInfos);
        // this.skillInfos.setSkillDescription("test");
        // this.add(this.samir);
    }

    setHero(hero: Hero) {
        const internalHero = hero.getInternalHero();
        this.heroPortrait.setTexture(internalHero.name, internalHero.stats.hp / internalHero.maxHP < 0.5 ? 'portrait-damaged' : 'portrait');
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
              x: -100,
              duration: 200
            });
        }

        console.log(internalHero.getWeapon());
        this.nameplate.updateNameplate({
            name: internalHero.name,
            weaponType: internalHero.getWeapon().type,
            weaponColor: internalHero.getWeapon().color,
        });
        this.maxHP.setText(`/ ${internalHero.maxHP}`);

        for (let stat of ["atk", "def", "res", "spd"]) {
            this[stat].setText(internalHero.stats[stat].toString());
        }

        this.weaponName.setText(internalHero.getWeapon().name);

        for (let skill of ["A", "B", "C", "S"] as const) {
            this[skill].off("pointerdown");

            if (internalHero.skills[skill]) {
                const skillName = internalHero.skills[skill].name;
                this[skill].setTexture(skillName);
                this[skill].setName(skillName);
                this[skill].on("pointerdown", () => {
                    this.skillInfos.setVisible(true);
                })
            } else {
                this[skill].setTexture("empty-skill");
                this[skill].setName("");
            }
        }
    }
};

export default UnitInfosBanner;
