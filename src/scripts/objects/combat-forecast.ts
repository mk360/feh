import { GameObjects, Tweens } from "phaser";
import HeroData from "feh-battles/dec/hero";
import HeroNameplate from "./hero-nameplate";
import { renderCritHPText, renderRegularHPText, renderText } from "../utils/text-renderer";
import HeroPortrait from "./hero-portrait";
import Stats from "../../interfaces/stats";
import TextColors from "../utils/text-colors";
import renderHP from "../utils/render-hp";

interface ForecastHeroData {
    hero: HeroData;
    statChanges: Partial<{
        [k in keyof Omit<Stats, "hp">]: number;
    }>;
    startHP: number;
    effective: boolean;
    remainingHP: number;
    turns: number;
    damage: number;
}

interface ForecastData {
    attacker: ForecastHeroData;
    defender: ForecastHeroData;
}

interface RenderedSide {
    portrait: GameObjects.Image;
    nameplate: HeroNameplate;
    previousHP: GameObjects.Text;
    predictedHP: GameObjects.Text;
    statMods: GameObjects.Group;
    damageLine: GameObjects.Image;
    roundCount: GameObjects.Text;
    damage: GameObjects.Text;
    hpBackground: GameObjects.Image;
    arrow: GameObjects.Text;
};

class CombatForecast extends Phaser.GameObjects.Container {
    private portraitDisplayTween: Tweens.Tween;
    private forecastBackground: GameObjects.Image;

    private firstHero: RenderedSide = {
        previousHP: null,
        statMods: null,
        damageLine: null,
        predictedHP: null,
        nameplate: null,
        portrait: null,
        roundCount: null,
        damage: null,
        hpBackground: null,
        arrow: null,
    };
    private secondHero: RenderedSide = {
        previousHP: null,
        statMods: null,
        predictedHP: null,
        arrow: null,
        damageLine: null,
        nameplate: null,
        portrait: null,
        roundCount: null,
        hpBackground: null,
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
            x: 170,
            y: hpTextHeight,
            style: {
                fontSize: "36px"
            },
            content: ""
        });
        this.firstHero.arrow = renderRegularHPText({
            scene: this.scene,
            x: this.firstHero.previousHP.getRightCenter().x + 70,
            y: hpTextHeight,
            content: "→",
            style: {
                fontSize: "36px"
            }
        });
        this.firstHero.predictedHP = renderRegularHPText({
            scene: this.scene,
            x: this.firstHero.previousHP.getRightCenter().x + 120,
            y: hpTextHeight,
            style: {
                fontSize: "36px"
            },
            content: ""
        });
        this.firstHero.hpBackground = new GameObjects.Image(this.scene, 250, hpLineHeight, "unit-bg").setScale(0.50, 0.75);
        this.firstHero.damage = renderText(this.scene, 230, 100, "", {
            fontSize: "18px"
        });
        this.firstHero.roundCount = renderText(this.scene, this.firstHero.damage.getRightCenter().x + 1, this.firstHero.damage.getTopCenter().y, "×2", {
            fontSize: "18px"
        });
        
        this.firstHero.damageLine = new GameObjects.Image(this.scene, this.firstHero.damage.getBottomLeft().x + 10, this.firstHero.damage.getBottomLeft().y, "stat-line").setOrigin(0.5, 0).setScale(0.2, 0.5);

        this.add(this.firstHero.portrait);
        this.add(this.firstHero.hpBackground);
        this.add(this.firstHero.previousHP);
        this.add(this.firstHero.predictedHP);
        this.add(this.firstHero.damageLine);
        this.add(this.firstHero.damage);
        this.add(this.firstHero.roundCount);
        this.add(this.firstHero.arrow);
        this.add(this.firstHero.nameplate);
    }

    private createSecondHero() {
        const hpTextHeight = 45;
        const hpLineHeight = 70;
        this.secondHero.statMods = new GameObjects.Group(this.scene);
        this.secondHero.portrait = new HeroPortrait(this.scene, "").setFlipX(true).setX(1200).setOrigin(1, 0);
        this.secondHero.nameplate = new HeroNameplate(this.scene, 390, 20, {
            name: "", weaponType: "", weaponColor: "",
        });
        this.secondHero.previousHP = renderRegularHPText({
            scene: this.scene,
            content: "",
            style: {
                fontSize: "36px",
            },
            x: 430,
            y: hpTextHeight,
        });
        this.secondHero.arrow = renderRegularHPText({
            scene: this.scene,
            x: this.secondHero.previousHP.getRightCenter().x + 70,
            y: hpTextHeight,
            content: "→",
            style: {
                fontSize: "36px"
            }
        });
        this.secondHero.predictedHP = renderCritHPText({
            scene: this.scene,
            content: 0,
            x: this.secondHero.previousHP.getRightCenter().x + 120,
            y: hpTextHeight,
            style: {
                fontSize: "36px"
            }
        });
        this.secondHero.damage = renderText(this.scene, this.secondHero.arrow.getCenter().x - 20, this.firstHero.damage.getTopCenter().y, "-", {
            fontSize: "18px"
        });
        this.secondHero.roundCount = renderText(this.scene, this.secondHero.damage.getRightCenter().x, this.secondHero.damage.getTopCenter().y, "", {
            fontSize: "18px"
        });
        this.secondHero.hpBackground = new GameObjects.Image(this.scene, 510, hpLineHeight, "unit-bg").setScale(0.50, 0.75);
        this.secondHero.damageLine = new GameObjects.Image(this.scene, this.firstHero.damageLine.x + 260, this.firstHero.damageLine.y, "stat-line").setOrigin(0.5, 0).setScale(0.2, 0.5)

        this.add(this.secondHero.portrait);
        this.add(this.secondHero.hpBackground);
        this.add(this.secondHero.previousHP);
        this.add(this.secondHero.predictedHP);
        this.add(this.secondHero.damageLine);
        this.add(this.secondHero.roundCount);
        this.add(this.secondHero.damage);
        this.add(this.secondHero.roundCount);
        this.add(this.secondHero.arrow);
        this.add(this.secondHero.nameplate);
    }

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        const hpLineHeight = 70;
        this.forecastBackground = new GameObjects.Image(scene, 0, 0, "forecast-bg").setOrigin(0, 0);
        this.add(this.forecastBackground);
        this.createFirstHero();
        this.createSecondHero();
        
        this.add(renderText(scene, this.forecastBackground.getCenter().x, hpLineHeight, "HP", {
            fontSize: "22px",
        }).setOrigin(0.5));
        
        this.portraitDisplayTween = scene.tweens.add({
            duration: 300,
            x: 850,
            targets: this.secondHero.portrait,
        });
    }

    disable() {
        this.koTween?.stop();
        this.setVisible(false);
    }

    private updateSide({ side, hero: params, statChangesX, xShift: xChangeBetweenStats }: {
        side: RenderedSide;
        hero: ForecastHeroData;
        statChangesX: number;
        xShift: number;
    }) {
        side.statMods.clear(true, true);
        const { statChanges, hero, effective, turns, damage } = params;
        side.damage.setText(damage === 0 && turns === 0 ? "-" : damage.toString()).setColor(effective ? TextColors.effective : TextColors.white);
        
        if (turns >= 2) {
            side.roundCount.setText("×" + turns);
            side.damage.x -= 10; 
            side.roundCount.setX(side.damage.getRightCenter().x);
        } else {
            side.roundCount.setText("");
        }

        let xOffset = statChangesX;

        for (let stat in statChanges) {
            if (statChanges[stat]) {
                const statValue = statChanges[stat];
                const statChangeValue = renderText(this.scene, xOffset, 140, `${statValue > 0 ? "+" : ""}${statValue}`, {
                    color: statValue < 0 ? TextColors.bane : TextColors.boon
                }).setOrigin(1, 0);
                const changedStat = renderText(this.scene, statChangeValue.getLeftCenter().x - 50, 140, capitalize(stat));
                side.statMods.add(changedStat).add(statChangeValue);
                this.add(side.statMods.getChildren());
                xOffset = changedStat.getLeftCenter().x + xChangeBetweenStats;
            }
        }

        side.nameplate.updateNameplate({
            name: hero.name,
            weaponColor: hero.getWeapon().color,
            weaponType: hero.getWeapon().type,
        });

        const texture = `portrait${hero.stats.hp / hero.maxHP < 0.5 ? "-damage" : ""}`;

        side.portrait.setTexture(hero.name, texture);

        side.previousHP.destroy();
        side.predictedHP.destroy();
        side.previousHP = renderHP({
            scene: this.scene,
            x: side.previousHP.x,
            y: side.previousHP.y,
            value: params.startHP,
            style: {
                fontSize: "36px"
            }
        });

        side.predictedHP = renderHP({
            scene: this.scene,
            x: side.predictedHP.x,
            y: side.predictedHP.y,
            value: params.remainingHP,
            style: {
                fontSize: "36px"
            }
        });

        this.add(side.predictedHP).add(side.previousHP);

        return this;
    }

    setForecastData(params: ForecastData) {
        this.updateSide({
            side: this.firstHero,
            statChangesX: this.forecastBackground.getCenter().x - 20,
            xShift: -5,
            hero: params.attacker
        }).updateSide({
            side: this.secondHero,
            statChangesX: this.forecastBackground.getCenter().x + 20,
            xShift: 5,
            hero: params.defender
        });

        if (this.koTween?.targets) {
            (this.koTween.targets[0] as GameObjects.Image)?.setAlpha(1);
            this.koTween.stop();
        }

        if (this.portraitDisplayTween) this.portraitDisplayTween.stop();
        this.portraitDisplayTween = this.scene.tweens.add({
            duration: 200,
            x: 850,
            onStart: () => {
                this.secondHero.portrait.x = 1100;
            },
            targets: this.secondHero.portrait,
        }).play();

        let koPortrait: GameObjects.Image;

        if (params.attacker.remainingHP === 0) {
            koPortrait = this.firstHero.portrait;
        }

        if (params.defender.remainingHP === 0) {
            koPortrait = this.secondHero.portrait;
        }

        if (koPortrait) this.runKOTween(koPortrait);
        
        return this;
    }

    runKOTween(target: GameObjects.Image) {
        if (this.koTween) {
            this.koTween.destroy();
        }

        this.koTween = this.scene.tweens.add({
            duration: 1500,
            loop: -1,
            targets: [target],
            yoyo: true,
            alpha: 0.6,
        }).play();
    }

    updatePortraits(attackerHPRatio: number, defenderHPRatio: number) {
        if (attackerHPRatio < 0.5 && !this.firstHero.portrait.frame.name.includes("damage")) {
            this.scene.tweens.add({
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
            this.scene.tweens.add({
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