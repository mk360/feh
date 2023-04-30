import Hero from "./hero";

interface ForecastData {
    attacker: Hero;
    defender: Hero;
    attackerDamage: number;
    defenderDamage: number;
    attackerEndHP: number;
    defenderEndHP: number;
}

class CombatForecast extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
    }

    setForecastData(params: ForecastData) {
        
    }

    update() {
        if (this.visible) {

        }
    }
}