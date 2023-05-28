import { renderCritHPText, renderRegularHPText, renderText } from "../utils/text-renderer";
import Hero from "./hero";
import TextColors from "../utils/text-colors";
import HeroNameplate from "./hero-nameplate";
import { GameObjects } from "phaser";
import SkillDetails from "./skill-details";
import Stats from "../../interfaces/stats";

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
    private weaponBg: GameObjects.Image;
    private assist: GameObjects.Text;
    private special: GameObjects.Text;
    private skillInfos: SkillDetails;
    private statLabels: {
        [k in keyof Stats]: {
            object: GameObjects.Text;
            description: string;
        };
    };
    
    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        const blockX = 310;
        this.add(new GameObjects.Image(scene, 0, 0, "unit-banner-bg").setOrigin(0, 0));
        this.heroPortrait = new GameObjects.Image(scene, -100, 0, "").setOrigin(0);
        this.add(this.heroPortrait);
        this.add(new GameObjects.Image(scene, blockX - 140, 70, "hp plate").setScale(1.15, 0.6).setOrigin(0, 0.5));
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

        const lvText = renderText(scene, 590, 15, "40", { fontSize: "20px"});

        this.atk = renderText(scene, blockX - 30, 95, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers);
        this.spd = renderText(scene, blockX + 80, 95, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers);
        this.def = renderText(scene, blockX - 30, 125, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers);
        this.res = renderText(scene, blockX + 80, 125, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers);
        this.add([this.nameplate]);
        
        this.add([this.atk, this.spd, this.def, this.res]);

        this.add(new GameObjects.Image(scene, blockX - 130, 120, "stat-line").setScale(0.2, 0.5).setOrigin(0));
        this.add(new GameObjects.Image(scene, blockX - 130, 150, "stat-line").setScale(0.2, 0.5).setOrigin(0));
        this.statLabels = {
            atk: {
                object: renderText(scene, blockX - 120, 95, "Atk", { fontSize: "18px" }),
                description: "The higher a unit's Atk, the more damage it will inflict on foes."
            },
            spd: {
                object: renderText(scene, blockX - 10, 95, "Spd", { fontSize: "18px" }),
                description: "A unit will attack twice if its Spd is at least 5 more than its foe."
            },
            res: {
                object: renderText(scene, blockX - 10, 125, "Res", { fontSize: "18px" }),
                description: "The higher a unit's Resistance is, the less damage it takes from magical attacks (spells, staves, breath effects, etc.)."
            },
            def: {
                object: renderText(scene, blockX - 120, 125, "Def", { fontSize: "18px" }),
                description: "The higher a unit's Defense is, the less damage it takes from physical attacks (swords, axes, lances, etc.)."
            },
            hp: {
                object: renderText(scene, blockX - 120, 54, "HP", { fontSize: "20px" }),
                description: "A unit is defeated if its Hit Points reach 0."
            }
        };

        for (let statKey in this.statLabels) {
            const castKey = statKey as keyof Stats;
            this.add(this.statLabels[castKey].object);
            this.statLabels[castKey].object.setInteractive().on("pointerdown", () => {
                const desc = this.statLabels[castKey].description;
                this.skillInfos.setSkillDescription("", desc);
                this.skillInfos.x = this.statLabels[castKey].object.x + 400;
                this.skillInfos.y = this.statLabels[castKey].object.y + 25;
                this.skillInfos.setVisible(!this.skillInfos.visible);
            });
        }

        this.add(renderText(scene, lvText.getLeftCenter().x, 0, "Lv.", { fontSize: "14px"}));
        this.add(lvText);
        this.S = new GameObjects.Image(scene, 715, lvText.getBottomCenter().y, "").setScale(0.5).setOrigin(0, 1);
        const S_Letter = new GameObjects.Image(scene, this.S.getBottomRight().x, this.S.getBottomRight().y, "S").setOrigin(1).setScale(0.5);
        this.add(this.S);
        this.add(S_Letter);
        this.C = new GameObjects.Image(scene, 690, lvText.getBottomCenter().y, "").setScale(0.5).setOrigin(0, 1);
        const C_Letter = new GameObjects.Image(scene, this.C.getBottomRight().x, this.C.getBottomRight().y, "C").setOrigin(1).setScale(0.5);
        this.add(this.C);
        this.add(C_Letter);
        this.B = new GameObjects.Image(scene, 665, lvText.getBottomCenter().y, "").setScale(0.5).setOrigin(0, 1);
        const B_Letter = new GameObjects.Image(scene, this.B.getBottomRight().x, this.B.getBottomRight().y, "B").setOrigin(1).setScale(0.5);
        this.add(this.B);
        this.add(B_Letter);
        this.A = new GameObjects.Image(scene, 640, lvText.getBottomCenter().y, "").setScale(0.5).setOrigin(0, 1);
        const A_Letter = new GameObjects.Image(scene, this.A.getBottomRight().x, this.A.getBottomRight().y, "A").setOrigin(1).setScale(0.5);
        this.add(this.A);
        this.add(A_Letter);
        this.skillInfos = new SkillDetails(scene, this.S.getCenter().x + 10, this.S.getBottomRight().y).setDepth(7).setVisible(false);
        this.weaponBg = new GameObjects.Image(this.scene, 490, 45, "weapon-bg").setOrigin(0, 0).setScale(0.23, 0.25).setInteractive();
        const assistBg = new GameObjects.Image(this.scene, 490, 85, "weapon-bg").setOrigin(0, 0).setScale(0.23, 0.25);
        const specialBg = new GameObjects.Image(this.scene, 490, 125, "weapon-bg").setOrigin(0, 0).setScale(0.23, 0.25);
        const assistIcon = new GameObjects.Image(this.scene, 490, 105, "assist-icon").setScale(0.45).setOrigin(0.25, 0.5);
        const specialIcon = new GameObjects.Image(this.scene, 490, 135, "special-icon").setScale(0.45).setOrigin(0.25, 0.5);
        this.add(this.weaponBg);
        // this.add(assistBg);
        // this.add(specialBg);
        // this.add(assistIcon);
        // this.add(specialIcon);
        this.weaponName = renderText(this.scene, this.weaponBg.getLeftCenter().x + 30, this.weaponBg.getCenter().y, "").setOrigin(0, 0.5).setStyle({
            fontSize: "19px"
        });
        this.add(this.weaponName);
        this.add(new GameObjects.Image(this.scene, 490, this.weaponBg.getLeftCenter().y, "weapon-icon").setScale(0.45).setOrigin(0.25, 0.5));
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
    }

    setHero(hero: Hero) {
        this.skillInfos.setVisible(false);
        const internalHero = hero.getInternalHero();
        const weapon = internalHero.getWeapon();
        this.weaponBg.off("pointerdown").on("pointerdown", () => {
            this.skillInfos.setVisible(!this.skillInfos.visible);
            this.skillInfos.setSkillDescription(weapon.name, weapon.description);
            this.skillInfos.y = this.weaponBg.y + 40;
            this.skillInfos.x = 750;
        });
        if (internalHero.boon) {
            this.statLabels[internalHero.boon].object.setColor(TextColors.boon);
            this.statLabels[internalHero.bane].object.setColor(TextColors.bane);
        } else {
            for (let statKey in this.statLabels) {
                const castKey = statKey as keyof Stats;
                this.statLabels[castKey].object.setColor("white");
            }
        }
        this.heroPortrait.setTexture(internalHero.name, internalHero.stats.hp / internalHero.maxHP < 0.5 ? 'portrait-damage' : 'portrait');
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

        this.nameplate.updateNameplate({
            name: internalHero.name,
            weaponType: weapon.type,
            weaponColor: weapon.color,
        });
        this.maxHP.setText(`/ ${internalHero.maxHP}`);
        const mapStats = internalHero.getMapStats();
        const baseStats = internalHero.stats;
        for (let stat of ["atk", "def", "res", "spd"] as const) {
            this[stat].setText(mapStats[stat].toString());
            this[stat].setColor(baseStats[stat] < mapStats[stat] ? TextColors.boon : baseStats[stat] > mapStats[stat] ? TextColors.bane : TextColors.numbers);
        }

        this.weaponName.setText(weapon.name);


        for (let skill of ["A", "B", "C", "S"] as const) {
            this[skill].off("pointerdown");
            const skillData = internalHero.skills[skill];
            this[skill].setTexture("skills", skillData.name);
            this[skill].setName(skillData.name);
            this[skill].setInteractive().on("pointerdown", () => {
                this.skillInfos.x = 750;
                this.skillInfos.y = this[skill].y;
                this.skillInfos.setSkillDescription(skillData.name, skillData.description);
                this.skillInfos.setVisible(!this.skillInfos.visible);
            });
        }
    }
};

export default UnitInfosBanner;
