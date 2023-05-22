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
};

class CombatForecast extends Phaser.GameObjects.Container {
    private portraitDisplayTween: Tweens.Tween;
    private attackerStatMods: GameObjects.Group;
    private defenderStatMods: GameObjects.Group;
    private attackerRoundCount: GameObjects.Text;
    private attackerRoundDamage: GameObjects.Text;
    private defenderRoundCount: GameObjects.Text;
    private defenderRoundDamage: GameObjects.Text;
    private firstPortraitSwitchingTween: Tweens.Tween;
    private secondPortraitSwitchingTween: Tweens.Tween;
    private firstSideBg: GameObjects.Rectangle;

    private firstHero: RenderedHero = {
        previousHP: null,
        predictedHP: null,
        nameplate: null,
        portrait: null,
    };
    private secondHero: RenderedHero = {
        previousHP: null,
        predictedHP: null,
        nameplate: null,
        portrait: null,
    };
    private koTween: Tweens.Tween;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        this.attackerStatMods = this.defenderStatMods = new GameObjects.Group(scene);
        this.firstSideBg = new GameObjects.Rectangle(scene, 0, 0, 750, 400, 0x002438).setOrigin(0);
        const canvas = scene.textures.createCanvas("gradient2", 1500, 340);
        const ctx = canvas.getContext();
        const gradient = ctx.createLinearGradient(0, 0, 1500, 0);
        gradient.addColorStop(0, "#00CFF2");
        gradient.addColorStop(0.15, "#002B43");
        gradient.addColorStop(0.22, "#001D30");
        gradient.addColorStop(0.42, "#2B0F04");
        gradient.addColorStop(0.55, "#A52F19");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1500, 400);
        this.add(this.firstSideBg);
        this.add(new GameObjects.Rectangle(scene, 750, 0, 750, 400, 0x9A2D18).setAlpha(0.7));
        this.add(new GameObjects.Image(scene, 0, 0, "gradient2").setOrigin(0, 0.5));
        this.firstHero.portrait = new HeroPortrait(scene, "");
        this.add(this.firstHero.portrait);
        this.secondHero.portrait = new HeroPortrait(scene, "").setFlipX(true).setX(1200).setOrigin(1, 0);
        this.firstHero.nameplate = new HeroNameplate(scene, 100, 20, { name: "", weaponType: "", weaponColor: "" });
        this.add(this.firstHero.nameplate);
        const hpLineHeight = 70;
        const hpTextHeight = 45;

        this.secondHero.nameplate = new HeroNameplate(scene, 377, 20, {
            name: "", weaponType: "", weaponColor: "",
        });
        const hpBg = new GameObjects.Image(scene, 250, hpLineHeight, "unit-bg").setScale(0.50, 0.75);
        const hpBg2 = new GameObjects.Image(scene, 510, hpLineHeight, "unit-bg").setScale(0.50, 0.75);
        
        this.add(this.secondHero.nameplate);
        this.add(this.secondHero.portrait);
        this.add([hpBg, hpBg2]);
        this.add(renderText(scene, this.firstSideBg.getCenter().x, hpLineHeight, "HP", {
            fontSize: "22px",
        }).setOrigin(0.5));
        this.firstHero.previousHP = renderRegularHPText({
            scene,
            x: 210,
            y: hpTextHeight,
            style: {
                fontSize: "36px"
            },
            content: ""
        }).setOrigin(1, 0);
        this.firstHero.predictedHP = renderRegularHPText({
            scene,
            x: 310,
            y: hpTextHeight,
            style: {
                fontSize: "36px"
            },
            content: ""
        }).setOrigin(1, 0);
        this.secondHero.previousHP = renderRegularHPText({
            scene,
            content: "",
            style: {
                fontSize: "36px",
            },
            x: 490,
            y: hpTextHeight,
        }).setOrigin(1, 0);
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
        this.secondHero.predictedHP = renderCritHPText({
            scene,
            content: 0,
            x: 550,
            y: hpTextHeight,
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

        this.firstPortraitSwitchingTween = scene.tweens.create({
            duration: 300,
            targets: [this.firstHero.portrait],
            yoyo: true,
            alpha: 0,
            onYoyo: () => {

            }
        });

        this.secondPortraitSwitchingTween = scene.tweens.create({
            duration: 300,
            targets: [this.secondHero.portrait],
            yoyo: true,
            alpha: 0,
            onYoyo: () => {

            }
        });

        this.portraitDisplayTween = scene.tweens.create({
            duration: 300,
            x: 850,
            targets: this.secondHero.portrait,
        });

        this.attackerRoundDamage = renderText(scene, 230, 100, "", {
            fontSize: "18px"
        });
        this.attackerRoundCount = renderText(scene, this.attackerRoundDamage.getRightCenter().x + 1, this.attackerRoundDamage.getTopCenter().y, "×2", {
            fontSize: "18px"
        })
        this.defenderRoundDamage = renderText(scene, this.attackerRoundDamage.getRightCenter().x + 240, this.attackerRoundDamage.getTopCenter().y, "-", {
            fontSize: "18px"
        });
        this.defenderRoundCount = renderText(scene, this.defenderRoundDamage.getRightCenter().x, this.defenderRoundDamage.getTopCenter().y, "");
        const damageUnderline = new GameObjects.Image(scene, this.attackerRoundDamage.getBottomLeft().x + 10, this.attackerRoundDamage.getBottomLeft().y, "stat-line").setOrigin(0.5, 0).setScale(0.2, 0.5);
        this.add(damageUnderline);
        this.add(new GameObjects.Image(scene, damageUnderline.x + 240, damageUnderline.y, "stat-line").setOrigin(0.5, 0).setScale(0.2, 0.5));
        this.add(this.defenderRoundDamage);
        this.add(this.attackerRoundCount);
        this.add(this.attackerRoundDamage);
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
        let xOffset = this.firstSideBg.getCenter().x - 35;
        for (let stat in attackerStatMods) {
            if (attackerStatMods[stat]) {
                const changedStat = renderText(this.scene, xOffset - 40, 140, capitalize(stat));
                const statValue = attackerStatMods[stat];
                this.attackerStatMods.add(changedStat);
                const statChangeValue = renderText(this.scene, xOffset - 5, 140, `${statValue > 0 ? "+" : ""}${statValue}`, {
                    color: statValue < 0 ? TextColors.bane : TextColors.boon
                });

                this.attackerStatMods.add(statChangeValue);
                this.add(statChangeValue);
                this.add(changedStat);
                xOffset -= 80
            }
        }

        let otherXOffset = this.firstSideBg.getCenter().x + 5;
        for (let stat in defenderStatMods) {
            if (defenderStatMods[stat]) {
                const changedStat = renderText(this.scene, otherXOffset, 140, capitalize(stat));
                const statValue = defenderStatMods[stat];
                this.defenderStatMods.add(changedStat);
                const statChangeValue = renderText(this.scene, otherXOffset + 60, 140, `${statValue > 0 ? "+" : ""}${statValue}`, {
                    color: statValue < 0 ? TextColors.bane : TextColors.boon
                });

                this.defenderStatMods.add(statChangeValue);
                this.add(statChangeValue);
                this.add(changedStat);
                otherXOffset += 85
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
        console.log(params.defender.turns);
        this.defenderRoundCount.setText("×" + params.defender.turns).setX(this.defenderRoundDamage.getRightCenter().x + 5);
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