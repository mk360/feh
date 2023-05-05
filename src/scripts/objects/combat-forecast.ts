import { GameObjects, Tweens } from "phaser";
import Hero from "./hero";
import HeroNameplate from "./hero-nameplate";

interface ForecastData {
    attacker: Hero;
    defender: Hero;
    attackerDamage: number;
    defenderDamage: number;
    attackerEndHP: number;
    defenderEndHP: number;
}

class CombatForecast extends Phaser.GameObjects.Container {
    private firstSideBg: GameObjects.Rectangle;
    private secondSideBg: GameObjects.Rectangle;
    private portraitDisplayTween: Tweens.Tween;
    private firstPortrait: GameObjects.Image;
    private firstNameplate: HeroNameplate;
    private secondPortrait: GameObjects.Image;
    private secnodNameplate: GameObjects.Image;
    private koTween: Tweens.Tween;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        this.firstSideBg = new GameObjects.Rectangle(scene, 0, 0, 750, 400, 0xFEDCBA).setOrigin(0);
        this.add(this.firstSideBg);
        this.add(new GameObjects.Rectangle(scene, 750, 0, 750, 400, 0xABCDEF));
        const nameplate = new HeroNameplate(scene, 95, 40, { name: "Dimitri", weaponType: "lance" });
        this.add(nameplate);

        const otherNameplate = new HeroNameplate(scene, 380, 40, {
            name: "Chrom", weaponType: "sword"
        });

        // this.portraitDisplayTween = []

        this.add(otherNameplate);
    }

    setForecastData(params: ForecastData) {
        
    }
}

export default CombatForecast;