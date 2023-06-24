import { renderRegularHPText, renderLabelText, renderText, renderBoonText, renderBaneText } from "../utils/text-renderer";
import Hero from "./hero";
import TextColors from "../utils/text-colors";
import HeroNameplate from "./hero-nameplate";
import { GameObjects } from "phaser";
import Stats from "../../interfaces/stats";
import Textbox from "./textbox";
import PassiveSkill from "feh-battles/dec/passive_skill";
import HeroData from "feh-battles/dec/hero";
import TextboxContent from "../../types/textbox-content";
import renderHP from "../utils/render-hp";

interface RenderedStat {
    label: GameObjects.Text;
    description: string;
    value: GameObjects.Text;
};

class UnitInfosBanner extends GameObjects.Container {
    private nameplate: HeroNameplate;
    private maxHP: GameObjects.Text;
    private weaponName: GameObjects.Text;
    private A: GameObjects.Image;
    private B: GameObjects.Image;
    private C: GameObjects.Image;
    private S: GameObjects.Image;
    private textboxTarget: string;
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
        this.add(new GameObjects.Image(scene, 0, 0, "unit-banner-bg").setOrigin(0, 0));
        this.heroPortrait = new GameObjects.Image(scene, -100, 0, "").setOrigin(0);
        this.add(this.heroPortrait);
        this.hpBackground = new GameObjects.Image(scene, blockX - 140, 70, "hp plate").setScale(1.15, 0.6).setOrigin(0, 0.5);
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
        });

        this.createStats();

        this.add([this.nameplate]);
        this.createMainSkills();
        const lvText = renderText(scene, 580, 15, "40", { fontSize: "20px"});
        this.add(renderText(scene, lvText.getLeftCenter().x + 5, lvText.getTopCenter().y - 15, "LV.", { fontSize: "14px"}));
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
    }

    private displayTextbox() {
        this.textbox.setVisible(true).setScale(0);
        this.scene.sound.playAudioSprite("sfx", "tap");
        this.scene.tweens.add({
            targets: [this.textbox],
            scale: 1,
            duration: 50
        }).play();
    }

    private createStats() {
        const blockX = 310;

        this.stats = {
            atk: {
                label: renderText(this.scene, blockX - 120, 100, "Atk", { fontSize: "18px" }),
                description: "The higher a unit's Atk, the more damage it will inflict on foes.",
                value: renderText(this.scene, blockX - 30, 100, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers)
            },
            spd: {
                label: renderText(this.scene, blockX - 10, 100, "Spd", { fontSize: "18px" }),
                description: "A unit will attack twice if its Spd is at least 5 more than its foe.",
                value: renderText(this.scene, blockX + 80, 100, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers)
            },
            res: {
                label: renderText(this.scene, blockX - 10, 135, "Res", { fontSize: "18px" }),
                description: "The higher a unit's Resistance is, the less damage it takes from magical attacks (spells, staves, breath effects, etc.).",
                value: renderText(this.scene, blockX + 80, 135, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers)
            },
            def: {
                label: renderText(this.scene, blockX - 120, 135, "Def", { fontSize: "18px" }),
                description: "The higher a unit's Defense is, the less damage it takes from physical attacks (swords, axes, lances, etc.).",
                value: renderText(this.scene, blockX - 30, 135, "", { fontSize: "18px" }).setOrigin(1, 0).setColor(TextColors.numbers)
            },
            hp: {
                label: renderText(this.scene, blockX - 120, 54, "HP", { fontSize: "20px" }),
                description: "A unit is defeated if its Hit Points reach 0.",
                value: renderRegularHPText({
                    scene: this.scene,
                    x: blockX - 60,
                    y: 50,
                    content: 0,
                    style: {
                        fontSize: "26px"
                    }
                })
            }
        };

        for (let statKey in this.stats) {
            const items = this.stats[statKey] as RenderedStat;
            this.add([items.label, items.value]);
        }
        this.add(new GameObjects.Image(this.scene, blockX - 130, 125, "stat-line").setScale(0.2, 0.5).setOrigin(0));
        this.add(new GameObjects.Image(this.scene, blockX - 130, 160, "stat-line").setScale(0.2, 0.5).setOrigin(0));
    }

    private createMainSkills() {
        this.weaponBg = new GameObjects.Image(this.scene, 490, 50, "skills-ui", "weapon-bg").setOrigin(0, 0).setScale(0.23, 0.25).setInteractive();
        this.assistBg = new GameObjects.Image(this.scene, 490, 90, "skills-ui", "assist-bg").setOrigin(0, 0).setScale(0.23, 0.25).setInteractive();
        this.specialBg = new GameObjects.Image(this.scene, 490, 130, "skills-ui", "special-bg").setOrigin(0).setDisplaySize(this.assistBg.displayWidth, this.assistBg.displayHeight).setInteractive();
        const assistIcon = new GameObjects.Image(this.scene, this.assistBg.getLeftCenter().x, this.assistBg.getLeftCenter().y, "skills-ui", "assist-icon").setScale(0.45).setOrigin(0.25, 0.5);
        const specialIcon = new GameObjects.Image(this.scene, this.specialBg.getLeftCenter().x, this.specialBg.getLeftCenter().y, "skills-ui", "special-icon").setScale(0.45).setOrigin(0.25, 0.5);
        this.add(this.weaponBg);
        this.add(this.assistBg);
        this.add(this.specialBg);
        this.add(assistIcon);
        this.add(specialIcon);
        this.add(new GameObjects.Image(this.scene, 490, this.weaponBg.getLeftCenter().y, "weapon-icon").setScale(0.45).setOrigin(0.25, 0.5));
    }

    private createPassives(lvText: GameObjects.Text) {
        this.A = new GameObjects.Image(this.scene, 620, lvText.getCenter().y, "").setScale(0.5).setOrigin(0, 0.5);
        this.B = new GameObjects.Image(this.scene, this.A.getRightCenter().x + 15, lvText.getCenter().y, "").setScale(0.5).setOrigin(0, 0.5);
        const A_Letter = new GameObjects.Image(this.scene, this.A.getBottomRight().x + 3, this.A.getBottomRight().y + 10, "skills-ui", "A").setOrigin(0, 1).setScale(0.5);
        const B_Letter = new GameObjects.Image(this.scene, this.B.getBottomRight().x + 3, this.B.getBottomRight().y + 10, "skills-ui", "B").setOrigin(0, 1).setScale(0.5);
        this.C = new GameObjects.Image(this.scene, this.B.getBottomRight().x + 15, lvText.getCenter().y, "").setScale(0.5).setOrigin(0, 0.5);
        const C_Letter = new GameObjects.Image(this.scene, this.C.getBottomRight().x + 3, this.C.getBottomRight().y + 10, "skills-ui", "C").setOrigin(0, 1).setScale(0.5);
        this.S = new GameObjects.Image(this.scene, this.C.getRightCenter().x + 15, lvText.getCenter().y, "").setScale(0.5).setOrigin(0, 0.5);
        const S_Letter = new GameObjects.Image(this.scene, this.S.getBottomRight().x + 3, this.S.getBottomRight().y + 10, "skills-ui", "S").setOrigin(0, 1).setScale(0.5);
        this.add([this.A, A_Letter, this.B, B_Letter, this.C, C_Letter, this.S, S_Letter]);
    }

    private updatePassives(hero: Hero) {
        for (let skill of ["A", "B", "C", "S"] as const) {
            this[skill].off("pointerdown");
            const skillData = hero.getInternalHero().skills[skill];
            this[skill].setTexture("skills", skillData.name).setDisplaySize(33, 33);
            this[skill].setName(skillData.name);
            this[skill].setInteractive().on("pointerdown", () => {
                this.textboxTarget = skill;
                this.textbox.clearContent();
                const skillInfosLines = this.createPassiveTextbox(skillData);
                this.textbox.x = this.S.getRightCenter().x;
                this.textbox.y = this.S.getBottomCenter().y + 5;
                this.textbox.setContent([skillInfosLines]);
                this.controlTextboxDisplay(skill);
            });
        }
    }

    private createStatTextbox({
        stat,
        baseValue,
        penalty,
        buff,
        boon,
        bane
    }: {
        stat: keyof Stats,
        baseValue: number,
        penalty?: number,
        buff?: number,
        boon?: keyof Stats,
        bane?: keyof Stats
    }) {
        const { description } = this.stats[stat];
        const lines: GameObjects.Text[][] = [];
        const valuesLines: GameObjects.Text[] = [];
        const baseValueLabel = renderLabelText({
            scene: this.scene,
            x: 0,
            y: 0,
            content: "Base Value"
        });
        const baseValueText = renderText(this.scene, baseValueLabel.getRightCenter().x + 10, 0, baseValue, { 
            fontSize: "18px"
        });
        valuesLines.push(baseValueLabel);
        valuesLines.push(baseValueText);
        if (buff > 0) {
            const buffLabel = renderLabelText({
                scene: this.scene,
                x: baseValueText.getRightCenter().x + 10,
                y: 0,
                content: "Buff"
            });
            const buffValue = renderBoonText({
                scene: this.scene,
                x: buffLabel.getRightCenter().x + 10,
                y: 0,
                content: "+" + buff,
                style: { fontSize: "18px" }
            });
            valuesLines.push(buffLabel);
            valuesLines.push(buffValue);
        }

        if (penalty < 0) {
            const penaltyLabel = renderLabelText({
                scene: this.scene,
                x: valuesLines[valuesLines.length - 1].getRightCenter().x + 10,
                y: 0,
                content: "Penalty"
            });
            const penaltyValue = renderBaneText({
                scene: this.scene,
                x: penaltyLabel.getRightCenter().x + 10,
                y: 0,
                content: penalty,
                style: { fontSize: "18px" }
            });
            valuesLines.push(penaltyLabel);
            valuesLines.push(penaltyValue);
        }

        lines.push(valuesLines);

        const modifiersLine: GameObjects.Text[] = [];
        if (bane === stat) {
            const flawText = renderBaneText({
                scene: this.scene,
                x: 0,
                y: 30,
                content: "Flaw",
                style: {
                    fontSize: "18px"
                }
            });
            modifiersLine.push(flawText);
        }
        if (boon === stat) {
            const assetText = renderBoonText({
                scene: this.scene,
                x: 0,
                y: 30,
                content: "Asset",
                style: {
                    fontSize: "18px"
                }
            });
            modifiersLine.push(assetText);
        }
        if (modifiersLine.length) lines.push(modifiersLine);

        const descLine: GameObjects.Text[] = [];
        const descriptionText = renderText(this.scene, 0, lines[lines.length - 1][0].y + 30, description, {
            fontSize: "18px",
        }).setWordWrapWidth(396);
        descLine.push(descriptionText);
        lines.push(descLine);
        return lines;
    }

    private controlTextboxDisplay(elementKey: string) {
        if (this.textboxTarget !== elementKey || !this.textbox.visible) {
            this.textboxTarget = elementKey;
            this.displayTextbox();
        }
        else this.hideTextbox();
    }

    private createPassiveTextbox(skillData: PassiveSkill) {
        const skillInfosLines = [];
        skillInfosLines.push(renderLabelText({
            scene: this.scene,
            x: 0,
            y: 0,
            content: skillData.name
        }));
        skillInfosLines.push(renderText(this.scene, 0, 40, skillData.description).setWordWrapWidth(390));

        return skillInfosLines;
    }

    hideTextbox() {
        this.scene.sound.playAudioSprite("sfx", "tap");
        this.scene.tweens.add({
            targets: [this.textbox],
            scale: 0,
            duration: 50,
            onComplete: () => {
                this.textbox.clearContent().setVisible(false);
            }
        }).play();
    }

    private weaponTextbox({ might, range, description }: { might: number, range: number, description: string }) {
        const firstLine = [
            renderLabelText({
                scene: this.scene,
                content: "Mt",
                x: 0,
                y: 0
            }),
            renderText(this.scene, 30, 0, might).setFontSize(18),
            renderLabelText({
                scene: this.scene,
                content: "Rng",
                x: 70,
                y: 0
            }),
            renderText(this.scene, 120, 0, range).setFontSize(18)
        ];

        const secondLine = [renderText(this.scene, 0, 30, description).setWordWrapWidth(440).setFontSize(18)];

        return [firstLine, secondLine];
    }

    private createAssistTextbox({
        description,
        range,
    }: { description: string, range: number }) {
        const rangeLabel = renderLabelText({
            scene: this.scene,
            x: 0,
            y: 0,
            content: "Rng"
        });

        const rangeText = renderText(this.scene, rangeLabel.getRightCenter().x + 10, 0, range, {
            fontSize: "18px"
        });

        const descText = renderText(this.scene, 0, 30, description, {
            fontSize: "18px"
        });

        const lines: TextboxContent[][] = [[rangeLabel, rangeText], [descText]];

        return lines;
    }

    private statDetailsCallback({ 
        statKey,
        hero
    }: {
        statKey: keyof Stats,
        hero: HeroData
    }) {
        return () => {
            this.textbox.clearContent();
            const content = this.createStatTextbox({
                stat: statKey,
                baseValue: hero.stats[statKey],
                boon: hero.boon,
                bane: hero.bane,
                penalty: hero.mapPenalties[statKey],
                buff: hero.mapBoosts[statKey]
            });
            this.textbox.x = this.stats[statKey].label.getRightCenter().x + 400;
            this.textbox.y = this.stats[statKey].label.getBottomLeft().y + 10;
            this.textbox.setContent(content)
            this.controlTextboxDisplay(statKey);
            this.textboxTarget = statKey;
        }
    }

    private createSpecialTextbox({ description, defaultCooldown, baseCooldown }) {
        const textLines: TextboxContent[][] = [];
        const firstLine: TextboxContent[] = [];
        const secondLine: TextboxContent[] = [];
        const specialIcon = new GameObjects.Image(this.scene, 0, 0, "skills-ui", "special-icon").setOrigin(0).setScale(0.5);
        const cooldownText = renderText(this.scene, 30, 5, defaultCooldown, {
            fontSize: "18px"
        });
        cooldownText.setColor(baseCooldown > defaultCooldown ? TextColors.boon : baseCooldown < defaultCooldown ? TextColors.bane : "white");
        cooldownText.setColor(defaultCooldown < baseCooldown ? TextColors.boon : defaultCooldown > baseCooldown ? TextColors.bane : "white");
        firstLine.push(specialIcon);
        firstLine.push(cooldownText);

        secondLine.push(renderText(this.scene, 0, 30, description, {
            fontSize: "18px"
        }));
        textLines.push(firstLine);
        textLines.push(secondLine);

        return textLines;
    };

    setHero(hero: Hero) {
        this.textbox.clearContent().setVisible(false);
        const internalHero = hero.getInternalHero();
        this.specialBg.off("pointerdown");
        if (internalHero.skills.special) {
            this.special.setText(internalHero.skills.special.name);
            this.specialBg.on("pointerdown", () => {
                const content = this.createSpecialTextbox(internalHero.skills.special);
                this.textbox.x = this.specialBg.getRightCenter().x;
                this.textbox.y = this.specialBg.getBottomCenter().y + 10;
                this.textbox.clearContent().setContent(content);
                this.controlTextboxDisplay("special");
            });
        } else {
            this.special.setText("-");
        }
        
        this.assistBg.off("pointerdown");
        if (internalHero.skills.assist) {
            this.assist.setText(internalHero.skills.assist.name);
            this.assistBg.on("pointerdown", () => {
                const content = this.createAssistTextbox(internalHero.skills.assist);
                this.textbox.clearContent().setContent(content);
                this.textbox.x = this.assistBg.getRightCenter().x;
                this.textbox.y = this.assistBg.getBottomCenter().y + 10;
                this.controlTextboxDisplay("assist");
            });
        } else {
            this.assist.setText("-");
        }
        const weapon = internalHero.getWeapon();
        this.weaponBg.off("pointerdown");
        if (weapon) {
            this.weaponName.setText(weapon.name);
            this.weaponBg.on("pointerdown", () => {
                this.textbox.clearContent();
                this.textbox.setContent(this.weaponTextbox(weapon));
                this.textbox.x = this.weaponBg.getRightCenter().x;
                this.textbox.y = this.weaponBg.getBottomCenter().y + 5;
                this.controlTextboxDisplay("weapon");
                this.textboxTarget = "weapon";
            });
        } else {
            this.weaponName.setText("-");
        }
        
        this.hpBackground.off("pointerdown").on("pointerdown", this.statDetailsCallback({
            statKey: "hp",
            hero: internalHero,
        }))

        for (let statKey in this.stats) {
            const castKey = statKey as keyof Stats;
            const { label, value } = this.stats[castKey];
            label.setInteractive().off("pointerdown").on("pointerdown", this.statDetailsCallback({ statKey: castKey, hero: internalHero })).setColor("white");

            value.setInteractive().off("pointerdown").on("pointerdown", this.statDetailsCallback({ statKey: castKey, hero: internalHero })).setText(internalHero.getMapStats()[statKey]);
            const statChange = internalHero.mapBoosts[statKey] + internalHero.mapPenalties[statKey];
            value.setColor(statChange > 0 ? TextColors.boon : statChange < 0 ? TextColors.bane : "white");
            if (statKey === "hp") {
                this.remove(this.stats.hp.value, true);
                this.stats.hp.value = renderHP({
                    scene: this.scene,
                    x: this.stats.hp.value.x,
                    y: this.stats.hp.value.y,
                    style: {
                        fontSize: "26px",
                    },
                    value: internalHero.stats.hp,
                });
                this.add(this.stats.hp.value);
            }
        }

        if (internalHero.boon && internalHero.bane) {
            this.stats[internalHero.boon].label.setColor(TextColors.boon);
            this.stats[internalHero.bane].label.setColor(TextColors.bane);
        }
        this.heroPortrait.setTexture(internalHero.name, internalHero.stats.hp / internalHero.maxHP < 0.5 ? 'portrait-damage' : 'portrait');

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

        this.updatePassives(hero);
    
        return this;
    }
};

export default UnitInfosBanner;
