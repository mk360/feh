import { renderCritHPText, renderRegularHPText, renderLabelText, renderText } from "../utils/text-renderer";
import Hero from "./hero";
import TextColors from "../utils/text-colors";
import HeroNameplate from "./hero-nameplate";
import { GameObjects } from "phaser";
import Stats from "../../interfaces/stats";
import Textbox from "./textbox";

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
    private textboxTarget: string;
    private heroPortrait: GameObjects.Image;
    private weaponBg: GameObjects.Image;
    private assist: GameObjects.Text;
    private special: GameObjects.Text;
    private textbox: Textbox;
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

        this.textbox = new Textbox(scene, 0, 0).setVisible(false);

        this.nameplate = new HeroNameplate(scene, blockX - 150, 25, {
            name: "",
            weaponType: "",
            weaponColor: "",
        });

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
                const vis = this.textboxTarget !== castKey && !(this.textboxTarget === castKey && this.textbox.visible);
                this.textboxTarget = castKey;
                if (vis) this.displayTextbox();
                else this.hideTextbox();
                const desc = this.statLabels[castKey].description;
            });
        }
        const lvText = renderText(scene, 580, 15, "40", { fontSize: "20px"});
        this.add(renderText(scene, lvText.getLeftCenter().x + 5, lvText.getTopCenter().y - 15, "LV.", { fontSize: "14px"}));
        this.add(lvText);
        this.A = new GameObjects.Image(scene, 620, lvText.getCenter().y, "").setScale(0.5).setOrigin(0, 0.5);
        this.B = new GameObjects.Image(scene, this.A.getRightCenter().x + 15, lvText.getCenter().y, "").setScale(0.5).setOrigin(0, 0.5);
        const A_Letter = new GameObjects.Image(scene, this.A.getBottomRight().x + 3, this.A.getBottomRight().y + 10, "A").setOrigin(0, 1).setScale(0.5);
        const B_Letter = new GameObjects.Image(scene, this.B.getBottomRight().x + 3, this.B.getBottomRight().y + 10, "B").setOrigin(0, 1).setScale(0.5);
        this.C = new GameObjects.Image(scene, this.B.getBottomRight().x + 15, lvText.getCenter().y, "").setScale(0.5).setOrigin(0, 0.5);
        const C_Letter = new GameObjects.Image(scene, this.C.getBottomRight().x + 3, this.C.getBottomRight().y + 10, "C").setOrigin(0, 1).setScale(0.5);
        this.S = new GameObjects.Image(scene, this.C.getRightCenter().x + 15, lvText.getCenter().y, "").setScale(0.5).setOrigin(0, 0.5);
        const S_Letter = new GameObjects.Image(scene, this.S.getBottomRight().x + 3, this.S.getBottomRight().y + 10, "S").setOrigin(0, 1).setScale(0.5);
        this.add(this.S);
        this.add(S_Letter);
        this.add(this.C);
        this.add(C_Letter);
        this.add(this.B);
        this.add(B_Letter);
        this.add(this.A);
        this.add(A_Letter);
        this.weaponBg = new GameObjects.Image(this.scene, 490, 50, "weapon-bg").setOrigin(0, 0).setScale(0.23, 0.25).setInteractive();
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
        this.add(this.textbox);
    }

    displayTextbox() {
        this.textbox.setVisible(true).setScale(0);
        this.scene.sound.playAudioSprite("sfx", "tap");
        this.scene.tweens.create({
            targets: [this.textbox],
            scale: 1,
            duration: 50
        }).play();
    }

    hideTextbox() {
        this.scene.sound.playAudioSprite("sfx", "tap");
        this.scene.tweens.create({
            targets: [this.textbox],
            scale: 0,
            duration: 50,
            onComplete: () => {
                this.textbox.setVisible(false);
            }
        }).play();
    }

    setHero(hero: Hero) {
        const internalHero = hero.getInternalHero();
        const weapon = internalHero.getWeapon();
        this.weaponBg.off("pointerdown").on("pointerdown", () => {
            this.textbox.clearContent();
            const firstLine = [
                renderLabelText({
                    scene: this.scene,
                    content: "Mt",
                    x: 0,
                    y: 0
                }),
                renderText(this.scene, 30, 0, weapon.might).setFontSize(18),
                renderLabelText({
                    scene: this.scene,
                    content: "Rng",
                    x: 70,
                    y: 0
                }),
                renderText(this.scene, 120, 0, weapon.range).setFontSize(18)
            ];

            const secondLine = [renderText(this.scene, 0, 30, weapon.description).setWordWrapWidth(440).setFontSize(18)];
            this.textbox.setContent([firstLine, secondLine]).setDepth(10);
            this.textbox.x = this.weaponBg.getRightCenter().x;
            this.textbox.y = this.weaponBg.getBottomCenter().y + 5;
            const vis = this.textboxTarget !== "weapon" || !(this.textboxTarget === "weapon" && this.textbox.visible);
            this.textboxTarget = "weapon";
            if (vis) {
                this.displayTextbox();
            } else this.hideTextbox();
        });
        for (let statKey in this.statLabels) {
            const castKey = statKey as keyof Stats;
            this.statLabels[castKey].object.setColor("white");
        }
        if (internalHero.boon) {
            this.statLabels[internalHero.boon].object.setColor(TextColors.boon);
            this.statLabels[internalHero.bane].object.setColor(TextColors.bane);
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
            this[skill].setTexture("skills", skillData.name).setDisplaySize(33, 33);
            this[skill].setName(skillData.name);
            this[skill].setInteractive().on("pointerdown", () => {
                const vis = this.textboxTarget !== skill || !(this.textboxTarget === skill && this.textbox.visible);
                this.textboxTarget = skill;
                const skillInfosLines = [];
                this.textbox.clearContent();
                skillInfosLines.push(renderLabelText({
                    scene: this.scene,
                    x: 0,
                    y: 0,
                    content: skillData.name
                }));
                this.textbox.x = this.S.getRightCenter().x;
                this.textbox.y = this.S.getBottomCenter().y + 5;
                skillInfosLines.push(renderText(this.scene, 0, 40, skillData.description).setWordWrapWidth(390));
                this.textbox.setContent([skillInfosLines]);
                if (vis) this.displayTextbox();
                else this.hideTextbox();
            });
        }
    }
};

export default UnitInfosBanner;
