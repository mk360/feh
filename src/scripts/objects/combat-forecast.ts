// import { GameObjects, Tweens } from "phaser";
// import HeroData from "feh-battles/dec/hero";
// import HeroNameplate from "./hero-nameplate";
// import { renderCritHPText, renderRegularHPText, renderText } from "../utils/text-renderer";
// import HeroPortrait from "./hero-portrait";
// import TextColors from "../utils/text-colors";
// import renderHP from "../utils/render-hp";

import { GameObjects, Scene, Tweens } from "phaser";
import HeroNameplate from "./hero-nameplate";
import HeroPortrait from "./hero-portrait";
import { getHealthyHPGradient, getLowHPGradient, renderNumberText, renderRegularHPText, renderText } from "../utils/text-renderer";
import TextColors from "../utils/text-colors";
import Stats from "../../interfaces/stats";
import Hero from "./hero";

interface ForecastHeroData {
    startHP: number;
    effectiveness: boolean;
    remainingHP: number;
    turns: number;
    entity: Hero;
    damageBeforeCombat: number;
    statMods: {
        [k in keyof Stats]: {
            buff?: number;
            debuff?: number;
        };
    };
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
    remainingHP: GameObjects.Text;
    statMods: GameObjects.Group;
    damageLine: GameObjects.Image;
    roundCount: GameObjects.Text;
    damage: GameObjects.Text;
    damageBeforeCombat: GameObjects.Text;
    arrow: GameObjects.Text;
};

const hpTextHeight = 60;
const hpLineHeight = 70;

class CombatForecast extends GameObjects.Container {
    private portraitDisplayTween: Tweens.Tween;
    private forecastBackground: GameObjects.Image;

    private firstHero: RenderedSide = {
        portrait: null,
        previousHP: null,
        statMods: null,
        damageLine: null,
        remainingHP: null,
        nameplate: null,
        roundCount: null,
        damage: null,
        arrow: null,
        damageBeforeCombat: null,
    };
    private secondHero: RenderedSide = {
        portrait: null,
        previousHP: null,
        statMods: null,
        remainingHP: null,
        arrow: null,
        damageLine: null,
        nameplate: null,
        roundCount: null,
        damage: null,
        damageBeforeCombat: null,
    };
    private koTween: Tweens.Tween;

    private createFirstHero() {
        this.firstHero.statMods = new GameObjects.Group(this.scene);
        this.firstHero.portrait = new HeroPortrait(this.scene, -100, "").setOrigin(0).setScale(0.6);
        this.firstHero.nameplate = new HeroNameplate(this.scene, 60, 20, {
            name: "",
            weaponColor: "",
            weaponType: "",
            tapCallbacks: {
                weaponType: null,
                name: null,
            }
        });
        this.firstHero.previousHP = renderRegularHPText({
            scene: this.scene,
            x: 130,
            y: hpTextHeight,
            style: {
                fontSize: "26px"
            },
            content: ""
        });
        this.firstHero.arrow = renderRegularHPText({
            scene: this.scene,
            x: this.firstHero.previousHP.getRightCenter().x + 40,
            y: hpTextHeight,
            content: "→",
            style: {
                fontSize: "26px"
            }
        });
        this.firstHero.remainingHP = renderRegularHPText({
            scene: this.scene,
            x: this.firstHero.arrow.getRightCenter().x + 10,
            y: hpTextHeight,
            style: {
                fontSize: "26px"
            },
            content: ""
        });
        this.firstHero.damageBeforeCombat = renderNumberText({
            scene: this.scene,
            x: this.firstHero.arrow.getBottomCenter().x - 30,
            y: 100,
            content: "",
            style: {
                fontSize: "18px"
            }
        });
        this.firstHero.damage = renderNumberText({
            scene: this.scene,
            x: this.firstHero.damageBeforeCombat.getRightCenter().x + 1,
            y: 100,
            content: "",
            style: {
                fontSize: "18px"
            }
        });
        this.firstHero.roundCount = renderNumberText({
            scene: this.scene,
            x: this.firstHero.damage.getRightCenter().x + 1,
            y: this.firstHero.damage.getTopCenter().y,
            content: "×2",
            style: {
                fontSize: "18px"
            }
        });

        this.firstHero.damageLine = new GameObjects.Image(this.scene, this.firstHero.damage.getBottomCenter().x + 10, this.firstHero.damage.getBottomLeft().y, "top-banner", "separator").setOrigin(0.5, 0).setScale(0.2, 0.5);
        const { statMods, ...ui } = this.firstHero;
        for (let uiElement in ui) {
            this.add(this.firstHero[uiElement]);
        }
    }

    private createSecondHero() {
        this.secondHero.statMods = new GameObjects.Group(this.scene);
        this.secondHero.portrait = new HeroPortrait(this.scene, 900, "").setFlipX(true).setOrigin(1, 0).setScale(0.6);
        this.secondHero.nameplate = new HeroNameplate(this.scene, 270, 20, {
            name: "", weaponType: "", weaponColor: "",
            tapCallbacks: {
                weaponType: null,
                name: null,
            }
        });
        this.secondHero.previousHP = renderRegularHPText({
            scene: this.scene,
            content: "",
            style: {
                fontSize: "26px",
            },
            x: 310,
            y: hpTextHeight,
        });
        this.secondHero.arrow = renderRegularHPText({
            scene: this.scene,
            x: this.secondHero.previousHP.getRightCenter().x + 40,
            y: hpTextHeight,
            content: "→",
            style: {
                fontSize: "26px"
            }
        });
        this.secondHero.remainingHP = renderRegularHPText({
            scene: this.scene,
            content: 0,
            x: this.secondHero.arrow.getRightCenter().x + 10,
            y: hpTextHeight,
            style: {
                fontSize: "26px"
            }
        });
        this.secondHero.damageBeforeCombat = renderNumberText({
            scene: this.scene,
            x: this.secondHero.arrow.getCenter().x,
            y: this.firstHero.damage.getTopCenter().y,
            content: "-",
            style: {
                fontSize: "18px"
            }
        });
        this.secondHero.damage = renderNumberText({
            scene: this.scene,
            x: this.secondHero.damageBeforeCombat.getCenter().x,
            y: this.firstHero.damageBeforeCombat.getTopCenter().y,
            content: "-",
            style: {
                fontSize: "18px"
            }
        });
        this.secondHero.roundCount = renderText(this.scene, this.secondHero.damage.getRightCenter().x, this.secondHero.damage.getTopCenter().y, "", {
            fontSize: "18px"
        });
        this.secondHero.damageLine = new GameObjects.Image(this.scene, this.firstHero.damageLine.x + 200, this.firstHero.damageLine.y, "top-banner", "separator").setOrigin(0.5, 0).setScale(0.2, 0.5).setTint(0xff0000);
        const { statMods, ...ui } = this.secondHero;
        for (let uiElement in ui) {
            this.add(this.secondHero[uiElement]);
        }
    }

    constructor(scene: Scene) {
        super(scene, 0, 71);
        this.forecastBackground = new GameObjects.Image(scene, 0, 0, "top-banner", "forecast-bg").setOrigin(0, 0);
        this.forecastBackground.setDisplaySize(+this.scene.game.config.width, this.forecastBackground.displayHeight);
        this.add(this.forecastBackground);
        this.createFirstHero();
        this.createSecondHero();

        this.add(renderText(scene, this.forecastBackground.getCenter().x, hpLineHeight - 10, "HP", {
            fontSize: "22px",
        }).setOrigin(0.5, 0));
    }

    private updateSide({ side, team, hero, statChangesX, xShift: xChangeBetweenStats }: {
        side: RenderedSide;
        team: "attacker" | "defender";
        hero: ForecastHeroData;
        statChangesX: number;
        xShift: number;
    }) {
        side.statMods.clear(true, true);
        side.damage.setText(hero.turns === 0 ? "-" : hero.damage.toString()).setColor(hero.effectiveness ? TextColors.effective : TextColors.numbers);
        if (hero.damageBeforeCombat) {
            side.damageBeforeCombat.setText(hero.damageBeforeCombat + "+");
            side.damage.setX(side.damageBeforeCombat.getRightCenter().x + 2);
        } else {
            side.damageBeforeCombat.setText("");
            side.damage.setX(side.damageBeforeCombat.getRightCenter().x);
        }

        side.roundCount.setX(side.damage.getRightCenter().x);
        if (hero.turns >= 2) {
            side.roundCount.setText("×" + hero.turns);
        } else {
            side.roundCount.setText("");
        }

        let xOffset = statChangesX;

        for (let stat in hero.statMods) {
            if (hero.statMods[stat]) {
                const statValue = hero.statMods[stat];
                const statChangeValue = renderText(this.scene, xOffset, 140, `${statValue > 0 ? "+" : ""}${statValue}`, {
                    color: statValue < 0 ? TextColors.bane : TextColors.boon
                }).setOrigin(1, 0);
                const changedStat = renderText(this.scene, statChangeValue.getLeftCenter().x - 35, 140, capitalize(stat));
                side.statMods.add(changedStat).add(statChangeValue);
                this.add(side.statMods.getChildren());
                if (team === "attacker") {
                    xOffset = changedStat.getLeftCenter().x + xChangeBetweenStats;
                } else {
                    xOffset = statChangeValue.getRightCenter().x + xChangeBetweenStats;
                }
            }
        }

        const { Weapon, Name, Stats } = hero.entity.getInternalHero();

        side.nameplate.updateNameplate({
            name: Name[0].value.split(":")[0],
            weaponColor: Weapon[0].color,
            weaponType: Weapon[0].weaponType,
        });

        const texture = `portrait${Stats[0].hp / Stats[0].maxHP < 0.5 ? "-damage" : ""}`;

        side.portrait.setTexture(Name[0].value, texture);
        const applyPredictedGradient = hero.remainingHP <= 10 ? getLowHPGradient : getHealthyHPGradient;
        const predictedHPGradient = applyPredictedGradient(side.remainingHP);
        side.remainingHP.setFill(predictedHPGradient).setText(hero.remainingHP.toString());

        const applyPreviousHPGradient = hero.startHP <= 10 ? getLowHPGradient : getHealthyHPGradient;
        const previousHPGradient = applyPreviousHPGradient(side.previousHP);
        side.previousHP.setFill(previousHPGradient).setText(hero.startHP.toString());

        return this;
    }

    setForecastData(params: ForecastData) {
        console.log(params);
        const forecastCenter = this.forecastBackground.getCenter();
        this.updateSide({
            side: this.firstHero,
            statChangesX: forecastCenter.x - 15,
            xShift: -5,
            team: "attacker",
            hero: params.attacker
        }).updateSide({
            side: this.secondHero,
            statChangesX: forecastCenter.x + 75,
            xShift: 65,
            team: "defender",
            hero: params.defender
        });

        if (this.koTween?.targets) {
            (this.koTween.targets[0] as GameObjects.Image)?.setAlpha(1);
            this.koTween.stop();
        }

        let koPortrait: GameObjects.Image;

        if (params.attacker.remainingHP === 0) {
            koPortrait = this.firstHero.portrait;
        }

        if (params.defender.remainingHP === 0) {
            koPortrait = this.secondHero.portrait;
        }

        if (koPortrait) this.runKOTween(koPortrait);

        if (this.portraitDisplayTween) this.portraitDisplayTween.stop();
        this.portraitDisplayTween = this.scene.tweens.add({
            duration: 300,
            x: 650,
            onStart: () => {
                this.secondHero.portrait.x = 1100;
            },
            targets: this.secondHero.portrait,
        }).play();

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

        const attackerPortraitSwitcher = this.switchPortraitsTween(this.firstHero.portrait, attackerHPRatio <= 0.5);
        const defenderPortraitSwitcher = this.switchPortraitsTween(this.secondHero.portrait, defenderHPRatio <= 0.5);

        if (attackerPortraitSwitcher) attackerPortraitSwitcher.play();
        if (defenderPortraitSwitcher) defenderPortraitSwitcher.play();
    }

    private switchPortraitsTween(portrait: GameObjects.Image, shouldBeDamaged: boolean) {
        const targetFrame = shouldBeDamaged ? "portrait-damage" : "portrait";
        const shouldDisplayDamagedPortrait = targetFrame === "portrait-damage" && !portrait.frame.name.includes("damage");
        const shouldDisplayStandardPortrait = targetFrame === "portrait" && portrait.frame.name.includes("damage");

        if (shouldDisplayDamagedPortrait || shouldDisplayStandardPortrait) {
            return this.scene.tweens.add({
                targets: [portrait],
                alpha: 0,
                duration: 100,
                yoyo: true,
                onYoyo: () => {
                    portrait.setFrame(targetFrame);
                }
            });
        }

        return null;
    }
}

function capitalize(str: string) {
    return str[0].toUpperCase() + str.substring(1, str.length);
}

export default CombatForecast;