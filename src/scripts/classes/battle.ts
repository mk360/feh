import FEH from "feh-battles";
import Hero from "feh-battles/dec/hero";
import Coords from "../../interfaces/coords";

const Mulagir = new FEH.Weapon();
Mulagir.setName("Mulagir")
    .setMight(14)
    .setType("bow")
    .setColor("colorless").setEffectiveness("flier");

const Ragnell = new FEH.Weapon();
Ragnell.setType("sword").setColor("red").setMight(19).setName("Ragnell");

Ragnell.onDefense = (effect) => {
    effect.wielder.raiseCursor("counterattack", 1);
};

Mulagir.onEquip = (hero) => {
    hero.raiseStat("spd", 3);
};

Mulagir.onBeforeCombat = ({ enemy, wielder }) => {
    if (enemy.getWeapon().type === "tome") {
        enemy.lowerCursor("mapBuff", 1);
    }

    if (enemy.movementType === "flier") {
        wielder.raiseCursor("effectiveness", 1);
    }
};

const DraconicRage = new FEH.Weapon({
    name: "Draconic Rage",
    might: 16,
    range: 1,
    type: "dragonstone",
    color: "blue",
});

DraconicRage.onBeforeCombat = ({ wielder, enemy }) => {
    let allyCount = 0;
    let enemyCount = 0;
    for (let ally of wielder.allies) {
        if (wielder.getDistance(ally) <= 2) allyCount++;
    }

    for (let e of enemy.allies) {
        if (e.getDistance(wielder) <= 2) enemyCount++;
    }

    if (allyCount > enemyCount) {
        wielder.setBattleMods({
            atk: 5,
            spd: 5,
        });
    }

    if (enemy.getWeapon().range === 2) {
        wielder.raiseCursor("lowerOfDefAndRes", 1);
    }
}

const Lyn = new FEH.Hero({
    name: "Lyn",
    stats: {
        hp: 35,
        atk: 33,
        spd: 35,
        def: 18,
        res: 28
    },
    movementType: "cavalry"
}).setWeapon(Mulagir);

const Ike = new FEH.Hero({
    name: "Ike",
    stats: {
        hp: 41,
        atk: 36,
        spd: 30,
        def: 35,
        res: 21
    },
    movementType: "infantry"
});

Ike.setWeapon(Ragnell);

const Corrin = new FEH.Hero({
    name: "Corrin",
    stats: {
        hp: 42,
        atk: 35,
        spd: 35,
        def: 31,
        res: 24   
    },
    movementType: "infantry",
});

Corrin.setWeapon(DraconicRage);

const Lucina = new FEH.Hero({
    name: "Lucina",
    movementType: "infantry",
    stats: {
        hp: 41,
        atk: 34,
        spd: 36,
        def: 27,
        res: 19
    }
});

const Geirskogul = new FEH.Weapon({
    name: "Geirskögul",
    type: "lance",
    color: "blue",
    might: 16,
    range: 1
});

Geirskogul.onBeforeAllyCombat = ({ ally, wielder }) => {
    if (ally.getDistance(wielder) <= 2 && ["sword", "lance", "axe", "bow", "dagger", "beast"].includes(ally.getWeapon().type)) {
        ally.setBattleMods({
            atk: 3,
            spd: 3
        });
    }
};

const SturdyBlow2 = new FEH.PassiveSkill().setName("Sturdy Blow 2").setSlot("A");

SturdyBlow2.onInitiate = ({ wielder }) => {
    wielder.setBattleMods({
        atk: 4,
        def: 4
    });
};

const DriveSpd2 = new FEH.PassiveSkill().setName("Drive Spd 2").setSlot("C");

DriveSpd2.onBeforeAllyCombat = ({ ally, wielder }) => {
    if (wielder.getDistance(ally) <= 2) {
        ally.setBattleMods({
            spd: 3
        });
    }
};

const AtkResBond3 = new FEH.PassiveSkill();
AtkResBond3.setName("Atk/Res Bond 3").setSlot("S");

AtkResBond3.onBeforeCombat = ({ wielder }) => {
    for (let ally of wielder.allies) {
        if (wielder.getDistance(ally) === 1) {
            wielder.setBattleMods({
                atk: 5,
                res: 5
            });

            return;
        }
    }
};

Lucina.setWeapon(Geirskogul);
Lucina.equipSkill(SturdyBlow2);
Lucina.equipSkill(AtkResBond3);
Lucina.equipSkill(DriveSpd2);

const AtkResForm3 = new FEH.PassiveSkill().setName("Atk/Res Form 3").setSlot("S");
const SacaesBlessing = new FEH.PassiveSkill().setName("Sacae's Blessing").setSlot("B");

SacaesBlessing.onInitiate = ({ enemy }) => {
    if (["sword", "axe", "lance"].includes(enemy.getWeapon().type)) {
        enemy.lowerCursor("counterattack", 1);
    }
};

Lyn.equipSkill(SacaesBlessing);

AtkResForm3.onBeforeCombat = ({ wielder }) => {
    let allyCount = 0;
    for (let ally of wielder.allies) {
        if (wielder.getDistance(ally) <= 2) allyCount++;
    }

    const boost = Math.min(allyCount * 2 + 1, 7);

    wielder.setBattleMods({
        atk: boost,
        res: boost,
    });
}

AtkResBond3.slot = "A";

Corrin.equipSkill(AtkResBond3);
Corrin.equipSkill(AtkResForm3);

const SpdResRein3 = new FEH.PassiveSkill().setName("Spd/Res Rein 3").setSlot("C");

SpdResRein3.onBeforeAllyCombat = ({ wielder, enemy }) => {
    if (wielder.getDistance(enemy) <= 2) {
        enemy.setBattleMods({
            spd: -4,
            res: -4
        });
    }
};

SpdResRein3.onBeforeCombat = ({ enemy }) => {
    enemy.setBattleMods({
        spd: -4,
        res: -4
    });
};


const Robin = new FEH.Hero({
    name: "Robin",
    weaponColor: "colorless",
    weaponType: "dragonstone",
    stats: {
        hp: 40,
        atk: 32,
        spd: 35,
        def: 30,
        res: 25
    },
    movementType: "flier"
});

Robin.equipSkill(SpdResRein3);

const Hector = new FEH.Hero({
    name: "Hector",
    weaponColor: "green",
    weaponType: "axe",
    stats: {
        hp: 47,
        atk: 40,
        spd: 23,
        def: 38,
        res: 26
    },
    movementType: "armored"
});

const ThunderArmads = new FEH.Weapon({
    name: "Thunder Armads",
    type: "axe",
    color: "green",
    might: 16,
    range: 1
});

ThunderArmads.onEquip = (wielder) => {
    wielder.raiseStat("def", 3);
};

ThunderArmads.onBeforeCombat = ({ wielder, enemy }) => {
    let allies = 0;
    let enemies = 0;
    for (let ally of wielder.allies) {
        if (wielder.getDistance(ally) <= 2) allies++;
    }

    for (let e of wielder.enemies) {
        if (wielder.getDistance(e) <= 2) enemies++;
    }

    if (allies > enemies) {
        enemy.lowerCursor("followup", 1);
    }
};

const DistantCounter = new FEH.PassiveSkill();
DistantCounter.setName("Distant Counter");
DistantCounter.setSlot("A");
DistantCounter.onDefense = ({ wielder }) => {
    wielder.raiseCursor("counterattack", 1);
}

Hector.equipSkill(DistantCounter);
Hector.setWeapon(ThunderArmads);

const VengefulFighter3 = new FEH.PassiveSkill();
VengefulFighter3.setName("Vengeful Fighter 3");
VengefulFighter3.setSlot("B");

VengefulFighter3.onDefense = ({ wielder }) => {
    if (wielder.stats.hp / wielder.maxHP >= 0.5) {
        wielder.raiseCursor("followup", 1);
    }
}

Hector.equipSkill(VengefulFighter3);

const Expiration = new FEH.Weapon({
    name: "Expiration",
    might: 16,
    range: 1,
    type: "dragonstone",
    color: "colorless",
});

Expiration.onEquip = (wielder) => {
    wielder.raiseCursor("counterattack", 1);
}

Expiration.onBeforeCombat = ({ wielder, enemy }) => {
    if (enemy.getWeapon().range === 2) {
        wielder.raiseCursor("lowerOfDefAndRes", 1);
    }
}

Robin.setWeapon(Expiration);

const Dragonskin = new FEH.PassiveSkill();
Dragonskin.setName("Dragonskin");
Dragonskin.setSlot("A");
Dragonskin.onBeforeCombat = ({ enemy }) => {
    if (enemy.getWeapon().effectiveAgainst.includes("flier")) {
        enemy.lowerCursor("effectiveness", 1);
    }
};

Dragonskin.onDefense = ({ wielder }) => {
    wielder.setBattleMods({
        def: 4,
        res: 4
    });
};

Robin.equipSkill(Dragonskin);

const Ryoma = new FEH.Hero({
    name: "Ryoma",
    weaponColor: "red",
    weaponType: "sword",
    stats: {
        hp: 41,
        atk: 34,
        spd: 39,
        def: 28,
        res: 20
    },
    movementType: "flier"
});

const Raijinto = new FEH.Weapon({
    range: 1,
    might: 16,
    type: "sword",
    color: "red",
    name: "Raijinto"
});

Ryoma.setWeapon(Raijinto);

const SwiftSparrow3 = new FEH.PassiveSkill().setName("Swift Sparrow 3").setSlot("A");

SwiftSparrow3.onInitiate = ({ wielder }) => {
    wielder.setBattleMods({
        atk: 6,
        spd: 6
    });
};

Lyn.equipSkill(SwiftSparrow3);

SwiftSparrow3.slot = "S";

Lyn.equipSkill(SwiftSparrow3);

class Battle {
    team1: ({ hero: Hero } & Coords)[];
    team2: ({ hero: Hero } & Coords)[];
    // todo: refactor into a key-value pair?
    map: {
        [k: number]: (Hero | null)[];
    }

    constructor() {
        this.team1 = [];
        this.team2 = [];
        this.map = {};
        for (let i = 1; i < 9; i++) {
            this.map[i] = Array.from<Hero>({ length: 6 }).fill(null);
        }
    }

    getDistance(tile1: Coords, tile2: Coords) {
        return Math.abs(tile1.x - tile2.x) + Math.abs(tile1.y - tile2.y);
    }

    moveHero(hero: Hero, destination: Coords) {
        const previousCoordinates = hero.coordinates;
        this.map[previousCoordinates.y][previousCoordinates.x] = null;
        hero.coordinates = destination;
        this.map[destination.y][destination.x] = hero;
    }

    addHero(hero: Hero, team: "team1" | "team2", startingCoordinates: { x: number; y: number }) {
        hero.coordinates = startingCoordinates;

        this[team].push({
            hero,
            ...startingCoordinates,
        });
    }

    startCombat(attacker: Hero, defender: Hero) {
        const c = new FEH.Combat({ attacker, defender }).createCombat();
        return c;
    }

    setAlliesAndEnemies() {
        for (let i = 0; i < this.team1.length; i++) {
            for (let j = i + 1; j < this.team1.length; j++) {
                this.team1[i].hero.setAlly(this.team1[j].hero);
                this.team1[j].hero.setAlly(this.team1[i].hero);
            }

            for (let j = 0; j < this.team2.length; j++) {
                this.team1[i].hero.setEnemy(this.team2[j].hero);
            }
        }

        for (let i = 0; i < this.team2.length; i++) {
            for (let j = i + 1; j < this.team2.length; j++) {
                this.team2[i].hero.setAlly(this.team2[j].hero);
                this.team2[j].hero.setAlly(this.team2[i].hero);
            }

            for (let j = 0; j < this.team2.length; j++) {
                this.team2[i].hero.setEnemy(this.team1[j].hero);
            }
        }
    }
};

const battle = new Battle();

battle.addHero(Hector, "team1", {
    x: 4,
    y: 1
});

battle.addHero(Lucina, "team1", {
    y: 1,
    x: 2
});

battle.addHero(Ryoma, "team1", {
    x: 3,
    y: 1
});

battle.addHero(Robin, "team1", {
    x: 5,
    y: 1
});

battle.addHero(Ike, "team2", {
    y: 7,
    x: 6
});

battle.addHero(Corrin, "team2", {
    y: 7,
    x: 4,
});

battle.addHero(Lyn, "team2", {
    y: 3,
    x: 3
});

battle.setAlliesAndEnemies();

export default battle;
