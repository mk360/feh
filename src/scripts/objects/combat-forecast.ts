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
    advantage: "advantage" | "neutral" | "disadvantage";
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
    statMods: GameObjects.Text[];
    roundCount: GameObjects.Text;
    damage: GameObjects.Text;
    damageBeforeCombat: GameObjects.Text;
    affinityArrow: GameObjects.Image;
};

const hpTextHeight = 60;

class CombatForecast extends GameObjects.Container {
    private portraitDisplayTween: Tweens.Tween;
    private forecastBackground: GameObjects.Image;
    private forecastUI: GameObjects.Image;

    private firstHero: RenderedSide = {
        portrait: null,
        previousHP: null,
        statMods: null,
        remainingHP: null,
        nameplate: null,
        roundCount: null,
        damage: null,
        damageBeforeCombat: null,
        affinityArrow: null,
    };
    private secondHero: RenderedSide = {
        portrait: null,
        previousHP: null,
        statMods: null,
        remainingHP: null,
        nameplate: null,
        roundCount: null,
        damage: null,
        damageBeforeCombat: null,
        affinityArrow: null,
    };
    private koTween: Tweens.Tween;

    private createFirstHero() {
        this.firstHero.statMods = [];
        this.firstHero.portrait = new HeroPortrait(this.scene, -100, "").setOrigin(0).setScale(0.6);
        this.firstHero.nameplate = new HeroNameplate(this.scene, 60, 20, {
            name: "",
            weaponColor: "",
            weaponType: "",
            tapCallbacks: {
                weaponType: null,
                name: null,
            },
            ally: true,
            rarity: 5,
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
        this.firstHero.remainingHP = renderRegularHPText({
            scene: this.scene,
            x: 195,
            y: hpTextHeight,
            style: {
                fontSize: "26px"
            },
            content: ""
        });
        this.firstHero.damageBeforeCombat = renderNumberText({
            scene: this.scene,
            x: 166,
            y: 98,
            content: "",
            style: {
                fontSize: "18px"
            }
        });
        this.firstHero.damage = renderNumberText({
            scene: this.scene,
            x: this.firstHero.damageBeforeCombat.getRightCenter().x + 1,
            y: 98,
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

        this.firstHero.affinityArrow = new GameObjects.Image(this.scene, this.scene.game.canvas.width / 2 - 30, 110, "statuses", "bonus").setScale(0.5);

        this.add(this.firstHero.portrait);
        this.add(this.firstHero.nameplate);
        this.add(this.firstHero.statMods);
    }

    private createSecondHero() {
        this.secondHero.statMods = [];
        this.secondHero.portrait = new HeroPortrait(this.scene, 900, "").setFlipX(true).setOrigin(1, 0).setScale(0.6);
        this.secondHero.nameplate = new HeroNameplate(this.scene, 270, 20, {
            name: "", weaponType: "", weaponColor: "",
            tapCallbacks: {
                weaponType: null,
                name: null,
            },
            rarity: 5,
            ally: false,
        });
        this.secondHero.previousHP = renderRegularHPText({
            scene: this.scene,
            content: "",
            style: {
                fontSize: "26px",
            },
            x: 300,
            y: hpTextHeight,
        });
        this.secondHero.remainingHP = renderRegularHPText({
            scene: this.scene,
            content: 0,
            x: 370,
            y: hpTextHeight,
            style: {
                fontSize: "26px"
            }
        });
        this.secondHero.damageBeforeCombat = renderNumberText({
            scene: this.scene,
            x: 350,
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
        this.secondHero.roundCount = renderText({
            scene: this.scene,
            x: this.secondHero.damage.getRightCenter().x,
            y: this.secondHero.damage.getTopCenter().y,
            content: "",
            style: {
                fontSize: "18px"
            }
        });
        this.secondHero.affinityArrow = new GameObjects.Image(this.scene, this.scene.game.canvas.width / 2 + 25, 110, "statuses", "bonus").setScale(0.5);

        this.add(this.secondHero.portrait);
        this.add(this.secondHero.nameplate);
        this.add(this.secondHero.statMods);
    }

    constructor(scene: Scene) {
        super(scene, 0, 71);
        this.forecastBackground = new GameObjects.Image(scene, 0, 0, "banners", "combat-forecast").setOrigin(0, 0);
        this.forecastBackground.setDisplaySize(+this.scene.game.config.width, this.forecastBackground.displayHeight);
        this.add(this.forecastBackground);
        this.createFirstHero();
        this.createSecondHero();
        this.add(new GameObjects.Image(this.scene, this.scene.game.canvas.width / 2, hpTextHeight + 30, "attack-forecast"));
        this.add(this.firstHero.previousHP);
        this.add(this.firstHero.remainingHP);
        this.add(this.firstHero.damageBeforeCombat);
        this.add(this.firstHero.damage);
        this.add(this.firstHero.roundCount);
        this.add(this.firstHero.affinityArrow);

        this.add(this.secondHero.previousHP);
        this.add(this.secondHero.remainingHP);
        this.add(this.secondHero.damageBeforeCombat);
        this.add(this.secondHero.damage);
        this.add(this.secondHero.roundCount);
        this.add(this.secondHero.affinityArrow);
    }

    private updateSide({ side, team, hero, statChangesX, xShift: xChangeBetweenStats }: {
        side: RenderedSide;
        team: "attacker" | "defender";
        hero: ForecastHeroData;
        statChangesX: number;
        xShift: number;
    }) {
        while (side.statMods.length) {
            const element = side.statMods.pop();
            element.destroy(true);
        }
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
                const statChangeValue = renderText({
                    scene: this.scene,
                    x: xOffset,
                    y: 140,
                    content: `${statValue > 0 ? "+" : ""}${statValue}`,
                    style: {
                        color: statValue < 0 ? TextColors.bane : TextColors.boon
                    }
                }).setOrigin(1, 0);
                const changedStat = renderText({
                    scene: this.scene,
                    x: statChangeValue.getLeftCenter().x - 35,
                    y: 140,
                    content: capitalize(stat)
                });
                side.statMods.push(changedStat);
                side.statMods.push(statChangeValue);
                this.add(changedStat);
                this.add(statChangeValue);
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
            ally: team === "attacker",
            rarity: 5,
        });

        const texture = `portrait${Stats[0].hp / Stats[0].maxHP < 0.5 ? "-damage" : ""}`;

        side.portrait.setTexture(Name[0].value, texture);
        const applyPredictedGradient = hero.remainingHP <= 10 ? getLowHPGradient : getHealthyHPGradient;
        const predictedHPGradient = applyPredictedGradient(side.remainingHP);
        side.remainingHP.setFill(predictedHPGradient).setText(hero.remainingHP.toString());

        const applyPreviousHPGradient = hero.startHP <= 10 ? getLowHPGradient : getHealthyHPGradient;
        const previousHPGradient = applyPreviousHPGradient(side.previousHP);
        side.previousHP.setFill(previousHPGradient).setText(hero.startHP.toString());

        side.affinityArrow.setVisible(true);

        switch (hero.advantage) {
            case "advantage": {
                side.affinityArrow.setFrame("bonus");
                break;
            }
            case "disadvantage": {
                side.affinityArrow.setFrame("penalty");
                break;
            }
            default: {
                side.affinityArrow.setVisible(false);
                break;
            }
        }

        return this;
    }

    setForecastData(params: ForecastData) {
        console.log({ params });
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