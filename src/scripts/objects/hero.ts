import renderText from "../utils/renderText";

const fullWidth = 60;

class Hero extends Phaser.GameObjects.Container {
    maxHP: number;
    HP: number;
    stats = {
        atk: 0,
        def: 0
    };
    hpBar: Phaser.GameObjects.Rectangle;
    hpBarBackground: Phaser.GameObjects.Rectangle;
    weaponType: Phaser.GameObjects.Image;
    image: Phaser.GameObjects.Image;
    hpText: Phaser.GameObjects.Text;
    team: "team1" | "team2";
    unitData: { name: string; weaponType: "sword" | "lance" | "axe" | "dragonstone" | "bow" | "tome" | "dagger"; movementType: "infantry" | "cavalry" | "flier" | "armored" };

    constructor(scene: Phaser.Scene, x: number, y: number, unitData: { name: string; weaponType: "sword" | "lance" | "axe" | "dragonstone" | "bow" | "tome" | "dagger"; movementType: "infantry" | "cavalry" | "flier" | "armored"; maxHP: number; atk: number; def: number }, team: "team1" | "team2") {
        super(scene, x, y);
        scene.add.existing(this);
        this.name = unitData.name;
        this.image = new Phaser.GameObjects.Image(scene, 0, 0, unitData.name).setScale(0.7);
        this.add(this.image);
        this.maxHP = this.HP = unitData.maxHP;
        this.stats.atk = unitData.atk;
        this.stats.def = unitData.def;
        this.team = team;
        const hpBarHeight = this.image.getBottomCenter().y - 20;        
        this.hpBar = new Phaser.GameObjects.Rectangle(scene, -13, hpBarHeight, fullWidth, 5, this.team === "team1" ? 0x54DFF4 : 0xFA4D69).setOrigin(0, 0);
        this.weaponType = new Phaser.GameObjects.Image(scene, -30, -40, unitData.weaponType);
        this.hpBarBackground = new Phaser.GameObjects.Rectangle(scene, -14, hpBarHeight - 1, fullWidth + 2, 7, 0x000000).setOrigin(0, 0);
        const teamDigits = this.team === "team1" ? "digits" : "red_digits";
        this.add(this.hpBarBackground);
        this.add(this.hpBar);
        this.add(this.weaponType);
        this.hpText = renderText(scene, -15, hpBarHeight, this.HP, {
            fontSize: "18px"
        }).setOrigin(1, 0.5);
        const gradient = this.hpText.context.createLinearGradient(0, 0, 0, this.hpText.height);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(0.7, this.team === "team1" ? "#54DFF4" : "#FA4D69");
        this.hpText.setFill(gradient);
        this.add(this.hpText);
        this.setSize(this.image.width, this.image.height);
        this.unitData = unitData;
    }

    attack(enemy: Hero) {
        const turns = [{ attacker: this, defender: enemy, damage: Math.max(0, this.stats.atk - enemy.stats.def), remainingHP: enemy.HP -  Math.max(0, this.stats.atk - enemy.stats.def)},
        { attacker: enemy, defender: this, damage: Math.max(0, enemy.stats.atk - this.stats.def), remainingHP: this.HP -  Math.max(0, enemy.stats.atk - this.stats.def) }];
        return turns;
    }

    update() {
    }

    getMovementRange() {
        if (this.unitData.movementType === "cavalry") return 3;
        if (this.unitData.movementType === "armored") return 1;
        return 2;
    }

    getWeaponRange() {
        if (["sword", "lance", "axe", "dragonstone"].includes(this.unitData.weaponType)) {
            return 1;
        }

        return 2;
    }
};

function threeDigits(n: number) {
    const s = n.toString().split("");
    if (s.length === 1) s.unshift("0");
    if (s.length === 2) s.unshift("0");
    return s;
}

export default Hero;
