import { renderRegularHPText, renderText, getLowHPGradient, getHealthyHPGradient } from "../utils/text-renderer";
import Hero from "./hero";
import { GameObjects } from "phaser";
import TextColors from "../utils/text-colors";
import HeroNameplate from "./hero-nameplate";
import Stats from "../../interfaces/stats";
import Textbox from "./textbox";
// import TextboxContent from "../../types/textbox-content";
import { STATS, WEAPON_TYPES } from "../../ui-data";
import HighlightRectangle from "./highlight-rectangle";

interface RenderedStat {
    label: GameObjects.Text;
    description: string;
    value: GameObjects.Text;
};

function replaceColorPlaceholder(placeholderData: string, replacingArgument: string) {
    const pascalCase = replacingArgument.replace(replacingArgument[0], replacingArgument[0].toUpperCase());
    return placeholderData.replace("%c", replacingArgument !== "colorless" ? pascalCase : "").trim();
}

class UnitInfosBanner extends GameObjects.Container {
    private nameplate: HeroNameplate;
    private maxHP: GameObjects.Text;
    private weaponName: GameObjects.Text;
    private A: GameObjects.Image;
    private B: GameObjects.Image;
    private C: GameObjects.Image;
    private displayedHero: Hero;
    private highlighter = new HighlightRectangle(this.scene)
    //     private S: GameObjects.Image;
    //     private textboxTarget: string;
    private heroPortrait: GameObjects.Image;
    private weaponBg: GameObjects.Image;
    private specialBg: GameObjects.Image;
    private special: GameObjects.Text;
    private textbox: Textbox;
    private stats: {
        [k in keyof Stats]: RenderedStat;
    };
    private assistBg: GameObjects.Image;
    private assist: GameObjects.Text;
    private hpBackground: GameObjects.Image;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        const blockX = 310;
        this.add(new GameObjects.Image(scene, 0, 0, "top-banner", "unit-banner-bg").setOrigin(0, 0));
        this.heroPortrait = new GameObjects.Image(scene, -100, 0, "").setOrigin(0).setScale(0.6);
        this.add(this.heroPortrait);
        this.hpBackground = new GameObjects.Image(scene, blockX - 140, 70, "top-banner", "hp plate").setScale(1.15, 0.6).setOrigin(0, 0.5);
        this.add(this.hpBackground.setInteractive());
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
            tapCallbacks: {
                name: (boundObject) => {
                    const internalHero = this.displayedHero.getInternalHero();
                    const heroDescription = internalHero.Name[0].description;
                    const descriptionLine = this.textbox.createDescriptionTextbox(heroDescription);
                    this.textbox.setContent(descriptionLine);
                    this.textbox.x = boundObject.getBottomCenter().x + 450;
                    this.textbox.y = boundObject.getBottomLeft().y + 25;
                    this.textbox.setVisible(true);
                },
                weaponType: (boundObject) => {
                    const internalHero = this.displayedHero.getInternalHero();
                    const weaponType = internalHero.Weapon[0].weaponType;
                    const weaponColor = internalHero.Weapon[0].color;
                    const weaponDescription = replaceColorPlaceholder(WEAPON_TYPES[weaponType], weaponColor);
                    this.textbox.x = boundObject.getBottomRight().x + 450;
                    this.textbox.y = boundObject.getBottomLeft().y + 25;
                    const weaponTypeDescription = this.textbox.createDescriptionTextbox(weaponDescription);
                    this.textbox.setContent(weaponTypeDescription);
                    this.textbox.setVisible(true);
                },
            }
        }).setInteractive();

        this.createStats();

        this.add(this.nameplate);
        this.createMainSkills();
        const lvText = renderText(scene, 580, 15, "40", { fontSize: "20px" });
        this.add(renderText(scene, lvText.getLeftCenter().x + 5, lvText.getTopCenter().y - 15, "Lv.", { fontSize: "14px" }));
        this.add(lvText);

        this.weaponName = renderText(this.scene, this.weaponBg.getLeftCenter().x + 30, this.weaponBg.getCenter().y, "").setOrigin(0, 0.5).setStyle({
            fontSize: "19px"
        });
        this.assist = renderText(this.scene, this.assistBg.getLeftCenter().x + 30, this.assistBg.getCenter().y, "").setOrigin(0, 0.5).setStyle({
            fontSize: "19px"
        });
        this.special = renderText(this.scene, this.specialBg.getLeftCenter().x + 30, this.specialBg.getCenter().y, "").setOrigin(0, 0.5).setStyle({
            fontSize: "19px"
        });
        this.add(this.weaponName);
        this.add(this.special);
        this.add(this.assist);
        this.add(this.maxHP);
        this.add(this.textbox);
        this.createPassives(lvText);
        this.add(this.highlighter);
    }

    //     private displayTextbox() {
    //         this.textbox.setVisible(true).setScale(0);
    //         this.scene.sound.playAudioSprite("sfx", "tap");
    //         this.scene.tweens.add({
    //             targets: [this.textbox],
    //             scale: 1,
    //             duration: 50
    //         }).play();
    //     }

    private createStats() {
        const blockX = 310;

        this.stats = {
            atk: {
                label: renderText(this.scene, blockX - 120, 100, "Atk", { fontSize: "18px" }).setInteractive(),
                description: STATS.atk,
                value: renderText(this.scene, blockX - 30, 100, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers).setInteractive()
            },
            spd: {
                label: renderText(this.scene, blockX - 10, 100, "Spd", { fontSize: "18px" }).setInteractive(),
                description: STATS.spd,
                value: renderText(this.scene, blockX + 80, 100, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers).setInteractive()
            },
            res: {
                label: renderText(this.scene, blockX - 10, 135, "Res", { fontSize: "18px" }).setInteractive(),
                description: STATS.res,
                value: renderText(this.scene, blockX + 80, 135, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers).setInteractive()
            },
            def: {
                label: renderText(this.scene, blockX - 120, 135, "Def", { fontSize: "18px" }).setInteractive(),
                description: STATS.def,
                value: renderText(this.scene, blockX - 30, 135, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers).setInteractive()
            },
            hp: {
                label: renderText(this.scene, blockX - 120, 54, "HP", { fontSize: "20px" }).setInteractive(),
                description: STATS.hp,
                value: renderRegularHPText({
                    scene: this.scene,
                    x: blockX - 60,
                    y: 50,
                    content: 0,
                    style: {
                        fontSize: "26px"
                    }
                }).setInteractive()
            }
        };

        for (let statKey in this.stats) {
            const castKey = statKey as keyof typeof this.stats;
            const { label, value, description } = this.stats[castKey];
            const statDetailsCallback = () => {
                const internalHero = this.displayedHero.getInternalHero();

                const content = this.textbox.createStatTextbox({
                    stat: castKey,
                    baseValue: statKey === "hp" ? internalHero.Stats[0].maxHP : internalHero.Stats[0][statKey],
                    boon: internalHero.Boon?.[0].value,
                    bane: internalHero.Bane?.[0].value,
                    // penalty: hero.mapPenalties[statKey],
                    // buff: hero.mapBoosts[statKey],
                    description
                });


                this.textbox.x = label.getRightCenter().x + 400;
                this.textbox.y = label.getBottomLeft().y + 10;
                this.textbox.setContent(content);
                this.textbox.setVisible(true);
                // this.controlTextboxDisplay(statKey);
                // this.textboxTarget = statKey;
            }

            label.on("pointerdown", () => {
                this.scene.sound.playAudioSprite("sfx", "tap");
                statDetailsCallback();

            });
            value.on("pointerdown", () => {
                this.scene.sound.playAudioSprite("sfx", "tap");
                statDetailsCallback();
                this.highlighter.highlightElement(value);
            });
            this.add([label, value]);
        }
        this.add(new GameObjects.Image(this.scene, blockX - 130, 125, "top-banner", "stat-glowing-line").setScale(0.2, 0.5).setOrigin(0));
        this.add(new GameObjects.Image(this.scene, blockX - 130, 160, "top-banner", "stat-glowing-line").setScale(0.2, 0.5).setOrigin(0));
    }

    private createMainSkills() {
        this.weaponBg = new GameObjects.Image(this.scene, 490, 50, "skills-ui", "weapon-bg").setOrigin(0, 0).setScale(0.23, 0.25).setInteractive();
        this.assistBg = new GameObjects.Image(this.scene, 490, 90, "skills-ui", "assist-bg").setOrigin(0, 0).setScale(0.23, 0.25).setInteractive();
        this.specialBg = new GameObjects.Image(this.scene, 490, 130, "skills-ui", "special-bg").setOrigin(0).setDisplaySize(this.assistBg.displayWidth, this.assistBg.displayHeight).setInteractive();
        const assistIcon = new GameObjects.Image(this.scene, this.assistBg.getLeftCenter().x, this.assistBg.getLeftCenter().y, "skills-ui", "assist-icon").setScale(0.45).setOrigin(0.25, 0.5);
        const specialIcon = new GameObjects.Image(this.scene, this.specialBg.getLeftCenter().x, this.specialBg.getLeftCenter().y, "skills-ui", "special-icon").setScale(0.45).setOrigin(0.25, 0.5);
        const weaponIcon = new GameObjects.Image(this.scene, 490, this.weaponBg.getLeftCenter().y, "skills-ui", "weapon-icon").setScale(0.45).setOrigin(0.25, 0.5);
        this.add(this.weaponBg);
        this.add(this.assistBg);
        this.add(this.specialBg);
        this.add(assistIcon);
        this.add(specialIcon);
        this.add(weaponIcon);
        this.weaponBg.on("pointerdown", () => {
            const internalHero = this.displayedHero.getInternalHero();
            this.scene.sound.playAudioSprite("sfx", "tap");
            const weapon = internalHero.Skill?.find((s) => s.slot === "weapon");
            if (weapon) {
                const weaponIdentity = internalHero.Weapon[0];
                const textboxLines = this.textbox.weaponTextbox({
                    might: weapon.might,
                    description: weapon.description,
                    range: weaponIdentity.range
                });

                this.textbox.setContent(textboxLines);
                this.textbox.x = this.weaponBg.getRightCenter().x;
                this.textbox.y = this.weaponBg.getBottomCenter().y + 5;
                this.textbox.setVisible(true);
            }
        });

        this.assistBg.on("pointerdown", () => {
            this.scene.sound.playAudioSprite("sfx", "tap");
            const internalHero = this.displayedHero.getInternalHero();
            const assist = internalHero.Skill?.find((s) => s.slot === "assist");
            if (assist) {
                const lines = this.textbox.assistTextbox({
                    description: assist.description,
                    range: assist.range
                });
                this.textbox.x = this.assistBg.getRightCenter().x;
                this.textbox.y = this.assistBg.getBottomCenter().y + 5;
                this.textbox.setContent(lines);
                this.textbox.setVisible(true);
            }
        });

        this.specialBg.on("pointerdown", () => {
            this.scene.sound.playAudioSprite("sfx", "tap");
            const internalHero = this.displayedHero.getInternalHero();
            const special = internalHero.Skill?.find((s) => s.slot === "special");
            if (special) {
                const textboxLines = this.textbox.specialTextbox({
                    cooldown: special.cooldown,
                    description: special.description,
                    baseCooldown: special.baseCooldown
                });

                this.textbox.setContent(textboxLines);
                this.textbox.x = this.specialBg.getRightCenter().x;
                this.textbox.y = this.specialBg.getBottomCenter().y + 5;
                this.textbox.setVisible(true);
            }
        });
    }

    private createPassives(lvText: GameObjects.Text) {
        this.A = new GameObjects.Image(this.scene, 650, lvText.getCenter().y, "").setScale(0.5).setOrigin(0, 0.5).setInteractive();
        this.B = new GameObjects.Image(this.scene, this.A.getRightCenter().x + 15, lvText.getCenter().y, "").setScale(0.5).setOrigin(0, 0.5).setInteractive();
        const A_Letter = new GameObjects.Image(this.scene, this.A.getBottomRight().x + 3, this.A.getBottomRight().y + 10, "skills-ui", "A").setOrigin(0, 1).setScale(0.5);
        const B_Letter = new GameObjects.Image(this.scene, this.B.getBottomRight().x + 3, this.B.getBottomRight().y + 10, "skills-ui", "B").setOrigin(0, 1).setScale(0.5);
        this.C = new GameObjects.Image(this.scene, this.B.getBottomRight().x + 15, lvText.getCenter().y, "").setScale(0.5).setOrigin(0, 0.5).setInteractive();
        const C_Letter = new GameObjects.Image(this.scene, this.C.getBottomRight().x + 3, this.C.getBottomRight().y + 10, "skills-ui", "C").setOrigin(0, 1).setScale(0.5);
        // this.S = new GameObjects.Image(this.scene, this.C.getRightCenter().x + 15, lvText.getCenter().y, "").setScale(0.5).setOrigin(0, 0.5);
        // const S_Letter = new GameObjects.Image(this.scene, this.S.getBottomRight().x + 3, this.S.getBottomRight().y + 10, "skills-ui", "S").setOrigin(0, 1).setScale(0.5);
        this.add([this.A, A_Letter, this.B, B_Letter, this.C, C_Letter/*, this.S, S_Letter*/]);

        for (let skillSlot of ["A", "B", "C"] as const) {
            this[skillSlot].on("pointerdown", () => {
                this.scene.sound.playAudioSprite("sfx", "tap");
                const internalHero = this.displayedHero.getInternalHero();
                const passive = internalHero.Skill?.find((s) => s.slot === skillSlot);
                if (passive) {
                    const passiveContent = this.textbox.createPassiveTextbox({
                        name: passive.name,
                        description: passive.description
                    });
                    this.textbox.setContent(passiveContent);
                    this.textbox.x = this.C.getRightCenter().x;
                    this.textbox.y = this.C.getBottomCenter().y + 5;
                    this.textbox.setVisible(true);
                }
            });
        }
    }

    private updatePassives(hero: Hero) {
        const internalHero = hero.getInternalHero();
        const skills = Object.groupBy(internalHero.Skill.filter((i) => ["A", "B", "C"].includes(i.slot)) as { name: string, slot: "A" | "B" | "C" }[], (s) => s.slot);
        const skillSlots = ["A", "B", "C"] as const;

        for (let skillSlot of skillSlots) {
            const usedSkill = skills[skillSlot]?.[0];
            const skillObject = this[skillSlot];
            if (usedSkill) {
                skillObject.setTexture("skills", usedSkill.name);
            } else {
                skillObject.setTexture("skills", "Empty Slot");
            }
        }
    }

    // TODO: migrate all these methods to the textbox class

    //     private controlTextboxDisplay(elementKey: string) {
    //         if (this.textboxTarget !== elementKey || !this.textbox.visible) {
    //             this.textboxTarget = elementKey;
    //             this.displayTextbox();
    //         }
    //         else this.hideTextbox();
    //     }

    //     hideTextbox() {
    //         this.scene.sound.playAudioSprite("sfx", "tap");
    //         this.scene.tweens.add({
    //             targets: [this.textbox],
    //             scale: 0,
    //             duration: 50,
    //             onComplete: () => {
    //                 this.textbox.clearContent().setVisible(false);
    //             }
    //         }).play();
    //     }

    setHero(hero: Hero) {
        this.displayedHero = hero;
        this.textbox.clearContent().setVisible(false);
        const internalHero = hero.getInternalHero();
        const { Name, Stats, Weapon, Skill } = internalHero;
        const name = Name[0].value
        const stats = Stats[0];
        const weapon = Weapon[0];
        let skills: Partial<{
            [k in "weapon" | "assist" | "special" | "A" | "B" | "C"]: Array<{
                name: string;
                description: string
            }>;
        }> = {};

        if (Skill) {
            skills = Object.groupBy(Skill as { slot: string }[], (skill) => skill.slot);
        }

        const { maxHP, hp } = stats;

        this.heroPortrait.setTexture(name, hp / maxHP < 0.5 ? "portrait-damage" : "portrait");
        if (skills.special) this.special.setText(skills.special[0].name);
        else this.special.setText("-");

        if (skills.assist) this.assist.setText(skills.assist[0].name);
        else this.assist.setText("-");

        if (skills.weapon) this.weaponName.setText(skills.weapon[0].name);
        else this.weaponName.setText("-");

        for (let statKey in this.stats) {
            const castKey = statKey as keyof Stats;
            const { label, value } = this.stats[castKey];
            if (castKey === internalHero.Boon[0]?.value) {
                label.setColor(TextColors.boon);
            } else if (castKey === internalHero.Bane[0]?.value) {
                label.setColor(TextColors.bane);
            }

            if (statKey === "hp") {
                const applyGradient = Stats[0].hp <= 10 ? getLowHPGradient : getHealthyHPGradient;
                const hpGradient = applyGradient(this.stats.hp.value);
                this.stats.hp.value.setFill(hpGradient).setText(Stats[0].hp);
            } else {
                value.setText(Stats[0][statKey]);
                // const statChange = internalHero.mapBoosts[statKey] + internalHero.mapPenalties[statKey];
                // value.setColor(statChange > 0 ? TextColors.boon : statChange < 0 ? TextColors.bane : "white");
            }
        }

        //         if (this.nameplate.heroName.text !== internalHero.name) {
        this.heroPortrait.x = -300;
        const heroPortraitIntroduction = this.scene.tweens.add({
            targets: this.heroPortrait,
            x: -100,
            duration: 200
        });

        heroPortraitIntroduction.play();
        //         }

        this.nameplate.updateNameplate({
            name: name.split(":")[0],
            weaponType: weapon.weaponType,
            weaponColor: weapon.color,
        });
        this.maxHP.setText(`/ ${stats.maxHP}`);

        this.updatePassives(hero);
    }
};

export default UnitInfosBanner;
