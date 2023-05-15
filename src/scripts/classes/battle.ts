import FEH from "feh-battles";
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

Mulagir.onBeforeCombat = (effect) => {
    effect.enemy.setBattleMods({
        atk: -15
    });
    if (effect.enemy.getWeapon().type === "tome") {
        effect.enemy.lowerCursor("mapBuff", 1);
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
    console.log(wielder.allies, wielder.allies.map(wielder.getDistance.bind(wielder)));
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

const CreatorSword = new FEH.Weapon({
    name: "Creator Sword",
    might: 16,
    type: "sword",
    color: "red",
    range: 1
});

CreatorSword.onDefense = ({ wielder }) => {
    wielder.raiseCursor("counterattack", 1);
};

class Battle {
    team1: ({ hero: typeof Lyn } & Coords)[];
    team2: ({ hero: typeof Lyn } & Coords)[];
    map: {
        [k: number]: (typeof Lyn | null)[];
    }

    constructor() {
        this.team1 = [];
        this.team2 = [];
    }

    getDistance(tile1: Coords, tile2: Coords) {
        return Math.abs(tile1.x - tile2.x) + Math.abs(tile1.y - tile2.y);
    }

    moveHero(hero: typeof Lyn, destination: Coords) {
        const previousCoordinates = hero.coordinates;
        this.map[previousCoordinates.y][previousCoordinates.x] = null;
        hero.coordinates = destination;
        this.map[destination.y][destination.x] = hero;
    }

    addHero(hero: typeof Lyn, team: "team1" | "team2", startingCoordinates: { x: number; y: number }) {
        const currentTeam = this[team];
        const otherTeam = this[team === "team1" ? "team2" : "team1"];
        for (let { hero: enemy } of otherTeam) {
            enemy.setEnemy(hero);
        }

        for (let { hero: ally } of currentTeam) {
            ally.setAlly(hero);
            hero.setAlly(ally);
        }

        hero.coordinates = startingCoordinates;

        this[team].push({
            hero,
            ...startingCoordinates,
        });
    }

    startCombat(attacker: typeof Lyn, defender: typeof Lyn) {
        const c = new FEH.Combat({ attacker, defender }).createCombat();
        return c;
    }
};

const battle = new Battle();

battle.addHero(Corrin, "team1", {
    y: 1,
    x: 2,
});

battle.addHero(Lyn, "team1", {
    y: 1,
    x: 5
});

battle.addHero(Ike, "team2", {
    y: 7,
    x: 6
});


export default battle;
