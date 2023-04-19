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
    moveRange: 2;
    attackRange: 1;
    image: Phaser.GameObjects.Image;
    hpHundreds: Phaser.GameObjects.Image = undefined;
    hpTens: Phaser.GameObjects.Image = undefined;
    team: string;
    hpUnits: Phaser.GameObjects.Image = undefined;
    private unitData: { name: string; weaponType: string; movementType: string };

    constructor(scene: Phaser.Scene, x: number, y: number, unitData: { name: string; weaponType: string, movementType: string; maxHP: number; atk: number; def: number }, team: string) {
        super(scene, x, y);
        scene.add.existing(this);
        this.image = new Phaser.GameObjects.Image(scene, 0, 0, unitData.name);
        this.add(this.image);
        this.maxHP = this.HP = unitData.maxHP;
        this.stats.atk = unitData.atk;
        this.stats.def = unitData.def;
        this.team = team;
        this.hpBar = new Phaser.GameObjects.Rectangle(scene, -13, 21, fullWidth, 5, this.team === "team1" ? 0x54DFF4 : 0xFA4D69).setOrigin(0, 0);
        this.weaponType = new Phaser.GameObjects.Image(scene, -30, -40, unitData.weaponType);
        this.hpBarBackground = new Phaser.GameObjects.Rectangle(scene, -14, 20, fullWidth + 1, 7, 0x000000).setOrigin(0, 0);
        
        this.add(this.hpBarBackground);
        this.add(this.hpBar);
        this.add(this.weaponType);
        this.setSize(this.image.width, this.image.height);
        this.hpHundreds = new Phaser.GameObjects.Image(scene, -38, 22, "digits", `0.png`);
        this.hpHundreds.setVisible(false);
        this.add(this.hpHundreds);
        this.hpTens = new Phaser.GameObjects.Image(scene, -34, 22, "digits", `0.png`).setVisible(false);
        this.add(this.hpTens);
        this.hpUnits = new Phaser.GameObjects.Image(scene, -22, 22, "digits", `0.png`).setVisible(false);
        this.add(this.hpUnits);
        this.unitData = unitData;
    }

    attack(enemy: Hero) {
        const turns = [{ attacker: this, defender: enemy, damage: Math.max(0, this.stats.atk - enemy.stats.def), remainingHP: enemy.HP -  Math.max(0, this.stats.atk - enemy.stats.def)},
        { attacker: enemy, defender: this, damage: Math.max(0, enemy.stats.atk - this.stats.def), remainingHP: this.HP -  Math.max(0, enemy.stats.atk - this.stats.def) }];
        return turns;
    }

    update() {
        const hpRatio = this.HP / this.maxHP;
        const hpDigits = threeDigits(this.HP);
        this.hpTens.setVisible(hpDigits[1] !== "0");
        this.hpHundreds.setVisible(hpDigits[0] !== "0");
        this.hpBar.displayWidth = fullWidth * hpRatio;
        this.hpHundreds.setVisible(hpDigits[0] !== "0").setFrame(`${hpDigits[0]}.png`);
        this.hpTens.setVisible(hpDigits[1] !== "0" || this.HP >= 100).setFrame(`${hpDigits[1]}.png`);
        this.hpUnits.setVisible(true).setFrame(`${hpDigits[2]}.png`);
    }

    setHPDigits(hp: number) {
        const x = threeDigits(hp);
        this.hpHundreds?.setVisible(hp >= 100);
        if (this.hpHundreds.visible) {
            this.hpHundreds.setFrame(x[0] + ".png");
        }
        return x;
    }

    getMovementRange() {
        if (this.unitData.movementType === "cavalry") return 3;
        if (this.unitData.movementType === "armored") return 1;
        return 4;
    }

    getWeaponRange() {
        if (this.unitData.weaponType === "sword" || this.unitData.weaponType === "lance") {
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
