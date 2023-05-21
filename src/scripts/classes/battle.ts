import FEH from "feh-battles";
import Hero from "feh-battles/dec/hero";
import Coords from "../../interfaces/coords";
import MapEffectRunner from "feh-battles/dec/map-effect";
import { Effect } from "feh-battles/dec/base_skill";
import Stats from "../../interfaces/stats";

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
});

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

const Ephraim = new FEH.Hero({
    name: "Ephraim",
    weaponColor: "green",
    weaponType: "axe",
    stats: {
        hp: 46,
        atk: 38,
        spd: 27,
        def: 37,
        res: 26
    },
    movementType: "armored"
});

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

const Mulagir = new FEH.Weapon();
Mulagir.setName("Mulagir")
    .setMight(14)
    .setType("bow")
    .setColor("colorless").setEffectiveness("flier");

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

const Ragnell = new FEH.Weapon();
Ragnell.setType("sword").setColor("red").setMight(19).setName("Ragnell");

Ragnell.onDefense = (effect) => {
    effect.wielder.raiseCursor("counterattack", 1);
};

const DraconicRage = new FEH.Weapon({
    name: "Draconic Rage",
    might: 16,
    range: 1,
    type: "dragonstone",
    color: "blue",
    description: "Accelerates Special trigger (cooldown count-1). If the number of allies within 2 spaces (excluding unit) > the number of foes within 2 spaces (excluding target), grants Atk/Spd+5 during combat. If foe's Range = 2, calculates damage using the lower of foe's Def or Res."
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

const Expiration = new FEH.Weapon({
    name: "Expiration",
    might: 16,
    range: 1,
    type: "dragonstone",
    color: "colorless",
    description: "Unit can counterattack regardless of foe's range. If foe's Range = 2, calculates damage using the lower of foe's Def or Res."
});

Expiration.onEquip = (wielder) => {
    wielder.raiseCursor("counterattack", 1);
};

Expiration.onBeforeCombat = ({ wielder, enemy }) => {
    if (enemy.getWeapon().range === 2) {
        wielder.raiseCursor("lowerOfDefAndRes", 1);
    }
};

const Geirskogul = new FEH.Weapon({
    name: "Geirskögul",
    type: "lance",
    color: "blue",
    might: 16,
    range: 1,
    description: "Grants Def+3. If allies within 2 spaces use sword, lance, axe, bow, dagger, or beast damage, grants Atk/Spd+3 to those allies during combat."
});

Geirskogul.onBeforeAllyCombat = ({ ally, wielder }) => {
    if (ally.getDistance(wielder) <= 2 && ["sword", "lance", "axe", "bow", "dagger", "beast"].includes(ally.getWeapon().type)) {
        ally.setBattleMods({
            atk: 3,
            spd: 3
        });
    }
};

const ThunderArmads = new FEH.Weapon({
    name: "Thunder Armads",
    type: "axe",
    color: "green",
    might: 16,
    range: 1,
    description: "Grants Def+3. If unit is within 3 spaces of an ally, inflicts Atk/Def-5 on foe during combat and foe cannot make a follow-up attack."
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

const Garm = new FEH.Weapon();
Garm.setName("Garm").setType("axe").setColor("green").setMight(16).setRange(1);

Garm.onEquip = (wielder) => {
    wielder.raiseStat("atk", 3);
};

Garm.onBeforeCombat = ({ wielder }) => {
    if (wielder.statuses.length) {
        wielder.raiseCursor("followup", 1);
    }
};

const Raijinto = new FEH.Weapon({
    range: 1,
    might: 16,
    type: "sword",
    color: "red",
    name: "Raijinto",
    description: "Unit can counterattack regardless of range."
});

Raijinto.onDefense = ({ wielder }) => {
    wielder.raiseCursor("counterattack", 1);
}

const DistantCounter = new FEH.PassiveSkill();
DistantCounter.setName("Distant Counter");
DistantCounter.setSlot("A");
DistantCounter.onDefense = ({ wielder }) => {
    wielder.raiseCursor("counterattack", 1);
}

const VengefulFighter3 = new FEH.PassiveSkill();
VengefulFighter3.setName("Vengeful Fighter 3");
VengefulFighter3.setSlot("B");

VengefulFighter3.onDefense = ({ wielder }) => {
    if (wielder.stats.hp / wielder.maxHP >= 0.5) {
        wielder.raiseCursor("followup", 1);
    }
}

const Dragonskin = new FEH.PassiveSkill();
Dragonskin.setName("Dragonskin");
Dragonskin.setSlot("A");
Dragonskin.setDescription("Neutralizes \"effective against flying\" bonuses. If foe initiates combat, grants Def/Res+4 during combat.");
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

const SturdyBlow2 = new FEH.PassiveSkill().setName("Sturdy Blow 2").setSlot("A").setDescription("If unit initiates combat, grants Atk/Def+4 during combat.");

SturdyBlow2.onInitiate = ({ wielder }) => {
    wielder.setBattleMods({
        atk: 4,
        def: 4
    });
};

const DriveSpd2 = new FEH.PassiveSkill().setName("Drive Spd 2").setSlot("C").setDescription("Grants Spd+3 to allies within 2 spaces during combat.");

DriveSpd2.onBeforeAllyCombat = ({ ally, wielder }) => {
    if (wielder.getDistance(ally) <= 2) {
        ally.setBattleMods({
            spd: 3
        });
    }
};

const AtkResBond3 = new FEH.PassiveSkill().setDescription("If unit is adjacent to an ally, grants Atk/Res+5 during combat.");
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

const AtkDefBond3 = new FEH.PassiveSkill();
AtkDefBond3.setName("Atk/Def Bond 3").setSlot("A").setDescription("If unit is adjacent to an ally, grants Atk/Def+5 during combat.");

AtkDefBond3.onBeforeCombat = ({ wielder }) => {
    for (let ally of wielder.allies) {
        if (wielder.getDistance(ally) === 1) {
            wielder.setBattleMods({
                atk: 5,
                def: 5
            });

            return;
        }
    }
};

const AtkResForm3 = new FEH.PassiveSkill().setName("Atk/Res Form 3").setSlot("S").setDescription("If unit is within 2 spaces of an ally, grants Atk/Res+X to unit during combat (X = 2 × number of allies within 2 spaces, + 1; max 7).");
const SacaesBlessing = new FEH.PassiveSkill().setName("Sacae's Blessing").setSlot("B");

SacaesBlessing.onInitiate = ({ enemy }) => {
    if (["sword", "axe", "lance"].includes(enemy.getWeapon().type)) {
        enemy.lowerCursor("counterattack", 1);
    }
};

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

const SpdResRein3 = new FEH.PassiveSkill().setName("Spd/Res Rein 3").setSlot("C").setDescription("Inflicts Spd/Res-4 on foes within 2 spaces during combat.");

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

const KestrelStance2 = new FEH.PassiveSkill().setName("Kestrel Stance 2").setSlot("A").setDescription("If foe initiates combat, grants Atk/Spd+4 during combat.");

KestrelStance2.onDefense = ({ wielder }) => {
    wielder.setBattleMods({
        atk: 4,
        spd: 4,
    });
};

const AtkSpdRein3 = new FEH.PassiveSkill().setName("Atk/Spd Rein 3").setSlot("C").setDescription("Inflicts Atk/Spd-4 on foes within 2 spaces during combat.");

AtkSpdRein3.onBeforeAllyCombat = ({ wielder, enemy }) => {
    if (wielder.getDistance(enemy) <= 2) {
        enemy.setBattleMods({
            atk: -4,
            spd: -4
        });
    }
};

AtkSpdRein3.onBeforeCombat = ({ enemy }) => {
    enemy.setBattleMods({
        atk: -4,
        spd: -4
    });
};

const WardingBreath = new FEH.PassiveSkill().setName("Warding Breath").setSlot("A");

WardingBreath.onDefense = ({ wielder }) => {
    wielder.setBattleMods({
        res: 4
    });
};

const JointDriveRes = new FEH.PassiveSkill().setName("Joint Drive Res").setSlot("C");

JointDriveRes.onBeforeAllyCombat = ({ ally, wielder }) => {
    if (wielder.getDistance(ally) <= 2) {
        ally.setBattleMods({
            res: 4
        });
    }
};

JointDriveRes.onBeforeCombat = ({ wielder }) => {
    for (let ally of wielder.allies) {
        if (wielder.getDistance(ally) <= 2) {
            wielder.setBattleMods({
                res: 4
            });

            return;
        }    
    }
};

const SealAtkDef2 = new FEH.PassiveSkill().setName("Seal Atk/Def 2").setSlot("B");

SealAtkDef2.onAfterCombat = ({ enemy, wielder }) => {
    const targetEnemies = enemy.allies.filter((ally) => ally.getDistance(enemy) <= 2);
    return [];
};

const Bushido2 = new FEH.PassiveSkill().setName("Bushido II").setSlot("B");

Bushido2.onBeforeCombat = ({ wielder, enemy, damage }) => {
    wielder.raiseCursor("damageIncrease", 7);
    if (enemy.getWeapon().effectiveAgainst.includes("flier")) {
        enemy.lowerCursor("effectiveness", 1);
    }
    if (wielder.getBattleStats().spd > enemy.getBattleStats().spd) {
        const reductionPercentage = Math.min(40, (wielder.getBattleStats().spd - enemy.getBattleStats().spd) * 4);
        console.log({ reductionPercentage, damage });
        wielder.raiseCursor("damageReduction", damage - Math.floor(damage * reductionPercentage));
    }
};


const CloseDef3 = new FEH.PassiveSkill().setSlot("A").setName("Close Def 3");

CloseDef3.onDefense = ({ wielder, enemy }) => {
    if (enemy.getWeapon().range === 1) {
        wielder.setBattleMods({
            def: 6,
            res: 6
        });
    }
};


const SwiftSparrow3 = new FEH.PassiveSkill().setName("Swift Sparrow 3").setSlot("A");

SwiftSparrow3.onInitiate = ({ wielder }) => {
    wielder.setBattleMods({
        atk: 6,
        spd: 6
    });
};

const OstiasPulse2 = new FEH.PassiveSkill().setName("Ostia's Pulse II").setSlot("C");

OstiasPulse2.onTurnStart = ({ wielder }) => {
    const effects: Effect[] = [];
    let moveTypes = {
        "armored": 1,
        "infantry": 0,
        "flier": 0,
        "cavalry": 0
    };

    const targetedAllies: Hero[] = [wielder];

    for (let ally of wielder.allies) {
        if (wielder.getDistance(ally) === 1) targetedAllies.push(ally);
        moveTypes[ally.movementType]++;
    }

    for (let targetableAlly of targetedAllies) {
        if (moveTypes[targetableAlly.movementType] <= 2) {
            effects.push({
                targetHeroId: targetableAlly.id,
                appliedEffect: {
                    stats: {
                        def: 6,
                        res: 6,
                    },
                }
            });
        }
    }

    return effects;
};

const Windsweep3 = new FEH.PassiveSkill().setName("Windsweep 3").setSlot("B");

Windsweep3.onInitiate = ({ wielder, enemy }) => {
    wielder.lowerCursor("followup", 1);
    if (["sword", "lance", "axe", "dagger", "bow", "beast"].includes(enemy.getWeapon().type)) {
        enemy.lowerCursor("counterattack", 1);
    }
};

const AtkSpdBond4 = new FEH.PassiveSkill().setName("Atk/Spd Bond 4").setSlot("S");

AtkSpdBond4.onBeforeCombat = ({ wielder }) => {
    for (let ally of wielder.allies) {
        if (wielder.getDistance(ally) === 1) {
            const statsBuffs: Partial<Stats> = {
                atk: 7,
                spd: 7,
            };
            for (let stat in wielder.mapMods) {
                if (wielder.mapMods[stat] < 0) {
                    statsBuffs[stat] += -wielder.mapMods[stat];
                    wielder.mapMods[stat] = 0;
                }
            }
            wielder.setBattleMods(statsBuffs);
            return;
        }
    }
};

const NullFollowUp3 = new FEH.PassiveSkill().setName("Null Follow-Up 3").setSlot("B");

NullFollowUp3.onBeforeCombat = ({ wielder }) => {
    wielder.raiseCursor("followup", 1);
};

const Swordbreaker3 = new FEH.PassiveSkill().setName("Swordbreaker 3").setSlot("B");

Swordbreaker3.onBeforeCombat = ({ wielder, enemy }) => {
    if (enemy.getWeapon().type === "sword") {
        wielder.raiseCursor("followup", 1);
        enemy.lowerCursor("followup", 1);
    }
};

const AtkDefSolo4 = new FEH.PassiveSkill().setName("Atk/Def Solo 4").setSlot("S");

AtkDefSolo4.onBeforeCombat = ({ wielder }) => {
    for (let ally of wielder.allies) {
        if (wielder.getDistance(ally) === 1) return;
    }

    wielder.setBattleMods({
        atk: 7,
        def: 7,
    });
};

const SpdSmoke3 = new FEH.PassiveSkill().setName("Spd Smoke 3").setSlot("S");
const AtkSmoke3 = new FEH.PassiveSkill().setName("Atk Smoke 3").setSlot("C");
const ResSmoke3 = new FEH.PassiveSkill().setName("Res Smoke 3").setSlot("S");
const HoneSpd2 = new FEH.PassiveSkill().setName("Hone Spd 2").setSlot("C");
const ArmorMarch3 = new FEH.PassiveSkill().setName("Armor March 3").setSlot("S");
const SpecialFighter3 = new FEH.PassiveSkill().setName("Special Fighter 3").setSlot("B");


Hector.equipSkill(DistantCounter);
Hector.equipSkill(VengefulFighter3);
Hector.setWeapon(ThunderArmads);
Hector.equipSkill(OstiasPulse2);
Hector.equipSkill(ArmorMarch3);

ArmorMarch3.slot = "C";

Corrin.setWeapon(DraconicRage);
Corrin.equipSkill(AtkDefBond3);
Corrin.equipSkill(AtkResForm3);
Corrin.equipSkill(NullFollowUp3);
Corrin.equipSkill(HoneSpd2);

Lucina.setWeapon(Geirskogul);
Lucina.equipSkill(SturdyBlow2);
Lucina.equipSkill(AtkSpdBond4);
Lucina.equipSkill(DriveSpd2);
Lucina.equipSkill(Windsweep3);

Ephraim.equipSkill(CloseDef3);
Ephraim.setWeapon(Garm);
Ephraim.equipSkill(AtkDefSolo4);
Ephraim.equipSkill(ArmorMarch3);
Ephraim.equipSkill(SpecialFighter3);

Robin.equipSkill(SpdResRein3);
Robin.setWeapon(Expiration);
Robin.equipSkill(Dragonskin);
Robin.equipSkill(ResSmoke3);
Robin.equipSkill(Swordbreaker3);

Lyn.setWeapon(Mulagir);
Lyn.equipSkill(SwiftSparrow3);
Lyn.equipSkill(SacaesBlessing);
Lyn.equipSkill(AtkSmoke3);
Lyn.equipSkill(SpdSmoke3);

Ryoma.setWeapon(Raijinto);
Ryoma.equipSkill(KestrelStance2);
Ryoma.equipSkill(AtkSpdRein3);
Ryoma.equipSkill(Bushido2);
Ryoma.equipSkill(SpdSmoke3);

Ike.setWeapon(Ragnell);
Ike.equipSkill(JointDriveRes);
Ike.equipSkill(WardingBreath);
Ike.equipSkill(SealAtkDef2);
Ike.equipSkill(AtkResForm3);


class Battle {
    team1: ({ hero: Hero } & Coords)[];
    team2: ({ hero: Hero } & Coords)[];
    // todo: refactor into a key-value pair?
    map: {
        [k: number]: (Hero | null)[];
    }

    private effectRunner: MapEffectRunner;

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

        this.effectRunner = new FEH.MapEffectRunner(this.team1.map(({ hero }) => hero), this.team2.map(({ hero }) => hero));
    }

    getMapEffects(team: "team1" | "team2", effect: "turnStart") {
        return this.effectRunner.runEffects(effect, team);
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

battle.addHero(Ephraim, "team2", {
    x: 3,
    y: 7
});

battle.addHero(Lyn, "team2", {
    y: 3,
    x: 5
});

battle.setAlliesAndEnemies();

export default battle;
