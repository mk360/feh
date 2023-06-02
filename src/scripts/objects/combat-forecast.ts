import { GameObjects, Tweens } from "phaser";
import Hero from "./hero";
import HeroNameplate from "./hero-nameplate";
import { renderBoonText, renderCritHPText, renderRegularHPText, renderText } from "../utils/text-renderer";
import HeroPortrait from "./hero-portrait";
import Stats from "../../interfaces/stats";
import TextColors from "../utils/text-colors";

interface ForecastHeroData {
    hero: Hero;
    statChanges: Partial<{
        [k in keyof Omit<Stats, "hp">]: number;
    }>;
    startHP: number;
    effective: boolean;
    endHP: number;
    turns: number;
    damage: number;
}

interface ForecastData {
    attacker: ForecastHeroData;
    defender: ForecastHeroData;
}

interface RenderedHero {
    portrait: GameObjects.Image;
    nameplate: HeroNameplate;
    previousHP: GameObjects.Text;
    predictedHP: GameObjects.Text;
    statMods: GameObjects.Group;
    roundCount: GameObjects.Text;
    damage: GameObjects.Text;
};

class CombatForecast extends Phaser.GameObjects.Container {
    private portraitDisplayTween: Tweens.Tween;
    private defenderRoundDamage: GameObjects.Text;
    private firstSideBg: GameObjects.Rectangle;

    private firstHero: RenderedHero = {
        previousHP: null,
        statMods: null,
        predictedHP: null,
        nameplate: null,
        portrait: null,
        roundCount: null,
        damage: null,
    };
    private secondHero: RenderedHero = {
        previousHP: null,
        statMods: null,
        predictedHP: null,
        nameplate: null,
        portrait: null,
        roundCount: null,
        damage: null,
    };
    private koTween: Tweens.Tween;

    private createFirstHero() {
        const hpTextHeight = 45;
        const hpLineHeight = 70;
        this.firstHero.statMods = new GameObjects.Group(this.scene);
        this.firstHero.portrait = new HeroPortrait(this.scene, "");
        this.firstHero.nameplate = new HeroNameplate(this.scene, 100, 20, {
            name: "",
            weaponColor: "",
            weaponType: ""
        });
        this.firstHero.previousHP = renderRegularHPText({
            scene: this.scene,
            x: 210,
            y: hpTextHeight,
            style: {
                fontSize: "36px"
            },
            content: ""
        }).setOrigin(1, 0);
        this.firstHero.predictedHP = renderRegularHPText({
            scene: this.scene,
            x: 310,
            y: hpTextHeight,
            style: {
                fontSize: "36px"
            },
            content: ""
        }).setOrigin(1, 0);
        const hpBg = new GameObjects.Image(this.scene, 250, hpLineHeight, "unit-bg").setScale(0.50, 0.75);
        this.firstHero.damage = renderText(this.scene, 230, 100, "", {
            fontSize: "18px"
        });
        this.firstHero.roundCount = renderText(this.scene, this.firstHero.damage.getRightCenter().x + 1, this.firstHero.damage.getTopCenter().y, "×2", {
            fontSize: "18px"
        })
    }

    private createSecondHero() {
        const hpTextHeight = 45;
        const hpLineHeight = 70;
        this.secondHero.statMods = new GameObjects.Group(this.scene);
        this.firstHero.portrait = new HeroPortrait(this.scene, "").setFlipX(true).setX(1200).setOrigin(1, 0);
        this.secondHero.nameplate = new HeroNameplate(this.scene, 377, 20, {
            name: "", weaponType: "", weaponColor: "",
        });
        this.secondHero.previousHP = renderRegularHPText({
            scene: this.scene,
            content: "",
            style: {
                fontSize: "36px",
            },
            x: 490,
            y: hpTextHeight,
        }).setOrigin(1, 0);
        this.secondHero.predictedHP = renderCritHPText({
            scene: this.scene,
            content: 0,
            x: 550,
            y: hpTextHeight,
            style: {
                fontSize: "36px"
            }
        });
        this.secondHero.damage = renderText(this.scene, this.firstHero.damage.getRightCenter().x + 240, this.firstHero.damage.getTopCenter().y, "-", {
            fontSize: "18px"
        });
        this.secondHero.roundCount = renderText(this.scene, this.secondHero.damage.getRightCenter().x, this.secondHero.damage.getTopCenter().y, "", {
            fontSize: "18px"
        });
        const hpBg2 = new GameObjects.Image(this.scene, 510, hpLineHeight, "unit-bg").setScale(0.50, 0.75);
    }

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        const hpLineHeight = 70;
        const hpTextHeight = 45;
        this.createFirstHero();
        this.createSecondHero();
        this.add(new GameObjects.Image(scene, 0, 0, "forecast-bg").setOrigin(0, 0));
        this.add(this.firstHero.nameplate);
        
        this.add(this.secondHero.nameplate);
        this.add(this.secondHero.portrait);
        this.add([hpBg, hpBg2]);
        this.add(renderText(scene, this.firstSideBg.getCenter().x, hpLineHeight, "HP", {
            fontSize: "22px",
        }).setOrigin(0.5));
        const arrow = renderRegularHPText({
            scene,
            x: 500,
            y: hpTextHeight,
            content: "→",
            style: {
                fontSize: "36px"
            }
        });
        const otherArrow = renderRegularHPText({
            scene,
            x: 215,
            y: hpTextHeight,
            content: "→",
            style: {
                fontSize: "36px"
            }
        });
        this.add(this.secondHero.previousHP);
        this.add(this.secondHero.predictedHP);
        this.add(arrow);
        this.add(otherArrow);
        this.add(this.firstHero.previousHP);
        this.add(this.firstHero.predictedHP);

        this.portraitDisplayTween = scene.tweens.create({
            duration: 300,
            x: 850,
            targets: this.secondHero.portrait,
        });

        const damageUnderline = new GameObjects.Image(scene, this.firstHero.damage.getBottomLeft().x + 10, this.firstHero.damage.getBottomLeft().y, "stat-line").setOrigin(0.5, 0).setScale(0.2, 0.5);
        this.add(damageUnderline);
        this.add(new GameObjects.Image(scene, damageUnderline.x + 240, damageUnderline.y, "stat-line").setOrigin(0.5, 0).setScale(0.2, 0.5));
        this.add(this.secondHero.roundCount);
        this.add(this.firstHero.damage);
    }

    setForecastData(params: ForecastData) {
        if (this.koTween) {
            (this.koTween.targets[0] as GameObjects.Image)?.setAlpha(1);
            this.koTween.stop();
        }
        this.remove(this.attackerStatMods.getChildren(), true);
        this.remove(this.defenderStatMods.getChildren(), true);
        this.attackerStatMods.clear();
        this.defenderStatMods.clear();
        const { attacker, defender } = params;
        const attackerStatMods = attacker.statChanges;
        const defenderStatMods = defender.statChanges;
        this.attackerRoundDamage.setText(attacker.damage.toString());
        this.attackerRoundDamage.setColor(attacker.effective ? TextColors.effective : TextColors.white);
        this.attackerRoundCount.setText(attacker.turns >= 2 ? "×" + attacker.turns.toString() : "").setX(this.attackerRoundDamage.getRightCenter().x);
        let xOffset = this.firstSideBg.getCenter().x - 20;
        for (let stat in attackerStatMods) {
            if (attackerStatMods[stat]) {
                const statValue = attackerStatMods[stat];
                const statChangeValue = renderText(this.scene, xOffset, 140, `${statValue > 0 ? "+" : ""}${statValue}`, {
                    color: statValue < 0 ? TextColors.bane : TextColors.boon
                }).setOrigin(1, 0);
                const changedStat = renderText(this.scene, statChangeValue.getLeftCenter().x - 50, 140, capitalize(stat));
                this.attackerStatMods.add(changedStat);
                this.attackerStatMods.add(statChangeValue);
                this.add(statChangeValue);
                this.add(changedStat);
                xOffset = changedStat.getLeftCenter().x - 5;
            }
        }

        let defenderXOffset = this.firstSideBg.getCenter().x + 20;
        for (let stat in defenderStatMods) {
            if (defenderStatMods[stat]) {
                const changedStat = renderText(this.scene, defenderXOffset, 140, capitalize(stat));
                const statValue = defenderStatMods[stat];
                this.defenderStatMods.add(changedStat);
                const statChangeValue = renderText(this.scene, changedStat.getRightCenter().x + 20, 140, `${statValue > 0 ? "+" : ""}${statValue}`, {
                    color: statValue < 0 ? TextColors.bane : TextColors.boon
                });

                this.defenderStatMods.add(statChangeValue);
                this.add(statChangeValue);
                this.add(changedStat);
                defenderXOffset = statChangeValue.getRightCenter().x + 5;
            }
        }
        this.firstHero.nameplate.weaponIcon.setTexture("weapons", attacker.hero.getInternalHero().getWeapon().color + "-" + attacker.hero.getInternalHero().getWeapon().type);
        this.firstHero.nameplate.heroName.setText(attacker.hero.getInternalHero().name);
        this.secondHero.nameplate.weaponIcon.setTexture("weapons", defender.hero.getInternalHero().getWeapon().color + "-" + defender.hero.getInternalHero().getWeapon().type);
        this.secondHero.nameplate.heroName.setText(defender.hero.getInternalHero().name);

        const firstDamaged = attacker.hero.getInternalHero().stats.hp / attacker.hero.getInternalHero().maxHP < 0.5 ? "-damage" : "";
        const secondDamaged = defender.hero.getInternalHero().stats.hp / defender.hero.getInternalHero().maxHP < 0.5 ? "-damage" : "";
        this.firstHero.portrait.setTexture(attacker.hero.getInternalHero().name, 'portrait' + firstDamaged);
        this.secondHero.portrait.setTexture(defender.hero.getInternalHero().name, 'portrait' + secondDamaged);
        this.secondHero.portrait.x = 1100;
        this.portraitDisplayTween.play();

        const firstHeroStartingHP = attacker.startHP < 10 ? renderCritHPText : renderRegularHPText;
        const firstHeroEndingHP = attacker.endHP < 10 ? renderCritHPText : renderRegularHPText;
        const secondHeroStartingHP = defender.startHP < 10 ? renderCritHPText : renderRegularHPText;
        const secondHeroEndingHP = defender.endHP < 10 ? renderCritHPText : renderRegularHPText;
        this.firstHero.previousHP.destroy();
        this.firstHero.predictedHP.destroy();
        this.firstHero.previousHP = firstHeroStartingHP({
            scene: this.scene,
            x: this.firstHero.previousHP.x,
            y: this.firstHero.previousHP.y,
            content: attacker.startHP,
            style: {
                fontSize: "36px"
            }
        }).setOrigin(1, 0);

        let portraitToHighlight: GameObjects.Image;

        if (attacker.endHP === 0) {
            portraitToHighlight = this.firstHero.portrait;
        }

        if (defender.endHP === 0) {
            portraitToHighlight = this.secondHero.portrait;
        }

        this.koTween = this.scene.tweens.create({
            duration: 1000,
            loop: -1,
            targets: portraitToHighlight,
            yoyo: true,
            alpha: 0.5,
        });
        
        this.koTween.play();

        this.firstHero.predictedHP = firstHeroEndingHP({
            scene: this.scene,
            x: this.firstHero.predictedHP.x,
            y: this.firstHero.predictedHP.y,
            content: attacker.endHP,
            style: {
                fontSize: "36px"
            }
        }).setOrigin(1, 0);


        this.add(this.firstHero.predictedHP);
        this.add(this.firstHero.previousHP);

        this.secondHero.previousHP.destroy();
        this.secondHero.predictedHP.destroy();

        this.secondHero.previousHP = secondHeroStartingHP({
            scene: this.scene,
            x: this.secondHero.previousHP.x,
            y: this.secondHero.previousHP.y,
            content: defender.startHP,
            style: {
                fontSize: "36px"
            }
        }).setOrigin(1, 0);

        this.secondHero.predictedHP = secondHeroEndingHP({
            scene: this.scene,
            x: this.secondHero.predictedHP.x,
            y: this.secondHero.predictedHP.y,
            content: defender.endHP,
            style: {
                fontSize: "36px"
            }
        });

        this.add(this.secondHero.predictedHP);
        this.add(this.secondHero.previousHP);
        this.defenderRoundDamage.setText(params.defender.damage && params.defender.turns ? params.defender.damage.toString() : "-");
        this.defenderRoundCount.setText(defender.turns >= 2 ? "×" + defender.turns.toString() : "").setX(this.defenderRoundDamage.getRightCenter().x + 2);
    }

    runKOTween(target: GameObjects.Image) {
        if (this.koTween) {
            this.koTween.destroy();
        }

        this.koTween = this.scene.tweens.create({
            duration: 500,
            loop: -1,
            targets: [target],
            yoyo: true,
            alpha: 0.6,
        });
    }

    updatePortraits(attackerHPRatio: number, defenderHPRatio: number) {
        if (attackerHPRatio < 0.5 && !this.firstHero.portrait.frame.name.includes("damage")) {
            this.scene.tweens.create({
                targets: [this.firstHero.portrait],
                alpha: 0,
                duration: 100,
                yoyo: true,
                onYoyo: () => {
                    this.firstHero.portrait.setFrame("portrait-damage");
                }
            }).play();
        }

        if (defenderHPRatio < 0.5 && !this.secondHero.portrait.frame.name.includes("damage")) {
            this.scene.tweens.create({
                targets: [this.secondHero.portrait],
                alpha: 0,
                duration: 100,
                yoyo: true,
                onYoyo: () => {
                    this.secondHero.portrait.setFrame("portrait-damage");
                }
            }).play();
        }
    }
}

function capitalize(str: string) {
    return str[0].toUpperCase() + str.substring(1, str.length);
}

export default CombatForecast;