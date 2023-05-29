import FEH from "feh-battles";
import Hero from "feh-battles/dec/hero";
import Coords from "../../interfaces/coords";
import MapEffectRunner from "feh-battles/dec/map-effect";
import { Effect } from "feh-battles/dec/base_skill";
import Stats from "../../interfaces/stats";
import { CombatOutcome } from "feh-battles/dec/combat";

const Ryoma = new FEH.Hero({
    name: "Ryoma",
    weaponColor: "red",
    weaponType: "sword",
    // stats: {
    //     hp: 41,
    //     atk: 34,
    //     spd: 39,
    //     def: 28,
    //     res: 20
    // },
    boon: "atk",
    bane: "spd",
    lv1Stats: {
        hp: 17,
        atk: 8,
        spd: 11,
        def: 6,
        res: 5
    },
    growthRates: {
        hp: 55,
        atk: 60,
        spd: 65,
        def: 50,
        res: 35
    },
    movementType: "flier"
});

const Lyn = new FEH.Hero({
    name: "Lyn",
    // stats: {
    //     hp: 35,
    //     atk: 33,
    //     spd: 35,
    //     def: 18,
    //     res: 28
    // },
    lv1Stats: {
        hp: 16,
        atk: 7,
        spd: 9,
        def: 5,
        res: 6
    },
    bane: "res",
    boon: "spd",
    growthRates: {
        hp: 45,
        atk: 60,
        spd: 60,
        def: 30,
        res: 50
    },
    weaponColor: "colorless",
    weaponType: "bow",
    movementType: "cavalry"
});

const Ike = new FEH.Hero({
    name: "Ike",
    // stats: {
    //     hp: 41,
    //     atk: 36,
    //     spd: 30,
    //     def: 35,
    //     res: 21
    // },
    lv1Stats: {
        hp: 19,
        atk: 10,
        spd: 6,
        def: 9,
        res: 10
    },
    boon: "hp",
    bane: "spd",
    growthRates: {
        hp: 50,
        atk: 60,
        spd: 55,
        def: 60,
        res: 40
    },
    weaponColor: "red",
    weaponType: "sword",
    movementType: "infantry"
});

const Corrin = new FEH.Hero({
    name: "Corrin",
    // stats: {
    //     hp: 42,
    //     atk: 35,
    //     spd: 35,
    //     def: 31,
    //     res: 24   
    // },
    lv1Stats: {
        hp: 16,
        atk: 7,
        spd: 7,
        def: 5,
        res: 5
    },
    growthRates: {
        hp: 60,
        atk: 65,
        spd: 65,
        def: 60,
        res: 45
    },
    boon: "spd",
    bane: "hp",
    weaponColor: "blue",
    weaponType: "dragonstone",
    movementType: "infantry",
});

const Lucina = new FEH.Hero({
    name: "Lucina",
    movementType: "infantry",
    weaponColor: "blue",
    weaponType: "lance",
    lv1Stats: {
        hp: 17,
        atk: 8,
        spd: 10,
        def: 8,
        res: 4
    },
    growthRates: {
        hp: 55,
        atk: 60,
        spd: 60,
        def: 45,
        res: 35
    },
    bane: "atk",
    boon: "def",
    // stats: {
    //     hp: 41,
    //     atk: 34,
    //     spd: 36,
    //     def: 27,
    //     res: 19
    // }
});

const Robin = new FEH.Hero({
    name: "Robin",
    weaponColor: "colorless",
    weaponType: "dragonstone",
    // stats: {
    //     hp: 40,
    //     atk: 32,
    //     spd: 35,
    //     def: 30,
    //     res: 25
    // },
    lv1Stats: {
        hp: 16,
        atk: 8,
        spd: 9,
        def: 8,
        res: 6
    },
    growthRates: {
        hp: 55,
        atk: 55,
        spd: 60,
        def: 50,
        res: 45
    },
    boon: "res",
    bane: "def",
    movementType: "flier"
});

const Ephraim = new FEH.Hero({
    name: "Ephraim",
    weaponColor: "green",
    weaponType: "axe",
    // stats: {
    //     hp: 46,
    //     atk: 38,
    //     spd: 27,
    //     def: 37,
    //     res: 26
    // },
    lv1Stats: {
        hp: 22,
        atk: 10,
        spd: 5,
        def: 11,
        res: 7
    },
    growthRates: {
        hp: 55,
        atk: 65,
        spd: 50,
        def: 60,
        res: 45
    },
    movementType: "armored"
});

const Hector = new FEH.Hero({
    name: "Hector",
    weaponColor: "green",
    weaponType: "axe",
    // stats: {
    //     hp: 47,
    //     atk: 40,
    //     spd: 23,
    //     def: 38,
    //     res: 26
    // },
    bane: "spd",
    boon: "def",
    lv1Stats: {
        hp: 23,
        atk: 10,
        spd: 6,
        def: 12,
        res: 4
    },
    growthRates: {
        hp: 55,
        atk: 70,
        spd: 40,
        def: 60,
        res: 50
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

Mulagir.setDescription("Effective against flying foes. Grants Spd+3. Neutralizes magic foe's bonuses (from skills like Fortify, Rally, etc.) during combat.");

const Ragnell = new FEH.Weapon();
Ragnell.setType("sword").setColor("red").setMight(19).setName("Ragnell");

Ragnell.setDescription("Unit can counterattack regardless of range.");

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

Expiration.onDefense = ({ wielder }) => {
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

Geirskogul.onEquip = (wielder) => {
    wielder.raiseStat("def", 3);
}

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
    let appliedDebuff = false;
    for (let ally of wielder.allies) {
        if (wielder.getDistance(ally) <= 2) allies++;
        if (wielder.getDistance(ally) <= 3 && !appliedDebuff) {
            enemy.setBattleMods({
                atk: -5,
                def: -5
            });
            appliedDebuff = true;
            enemy.lowerCursor("followup", 1);
        }
    }

    for (let e of wielder.enemies) {
        if (wielder.getDistance(e) <= 2) enemies++;
    }

    if (allies > enemies) {
        enemy.lowerCursor("followup", 1);
    }
};

const Garm = new FEH.Weapon();
Garm.setName("Garm").setType("axe").setColor("green").setMight(16).setRange(1).setDescription("Grants Atk+3. If a bonus granted by a skill like Rally or Hone and/or 1 extra space of movement granted by a skill like Armor March or Armored Boots is active, unit makes a guaranteed follow-up attack.");

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

DistantCounter.setDescription("Unit can counterattack regardless of foe's range.");

const VengefulFighter3 = new FEH.PassiveSkill();
VengefulFighter3.setName("Vengeful Fighter 3");
VengefulFighter3.setSlot("B");

VengefulFighter3.setDescription("If unit's HP ≥ 50% and foe initiates combat, grants Special cooldown charge +1 per unit's attack, and unit makes a guaranteed follow-up attack. (Does not stack.)")

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

WardingBreath.setDescription("If foe initiates combat, grants Res+4 during combat and Special cooldown charge +1 per attack. (Only highest value applied. Does not stack.)")

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

JointDriveRes.setDescription("Grants Res+4 to allies within 2 spaces during combat. If unit is within 2 spaces of an ally, grants Res+4 to unit during combat.")

const SealAtkDef2 = new FEH.PassiveSkill().setName("Seal Atk/Def 2").setSlot("B");

SealAtkDef2.onAfterCombat = ({ enemy, wielder }) => {
    const targetEnemies = enemy.allies.filter((ally) => ally.getDistance(enemy) <= 2);
    return [];
};

SealAtkDef2.setDescription("Inflicts Atk/Def-5 on foe through its next action after combat.");

const Bushido2 = new FEH.PassiveSkill().setName("Bushido II").setSlot("B");

Bushido2.onBeforeCombat = ({ wielder, enemy, damage }) => {
    enemy.raiseCursor("damageIncrease", 7);
    if (enemy.getWeapon().effectiveAgainst.includes("flier")) {
        enemy.lowerCursor("effectiveness", 1);
    }
    if (wielder.getBattleStats().spd > enemy.getBattleStats().spd) {
        const reductionPercentage = Math.min(40, (wielder.getBattleStats().spd - enemy.getBattleStats().spd) * 4);
        // wielder.raiseCursor("damageReduction", damage - Math.floor(damage * reductionPercentage));
    }
};

Bushido2.setDescription("Neutralizes \"effective against flying\" bonuses. Deals +7 damage. If unit's Spd > foe's Spd, reduces damage from attacks during combat and from area-of-effect Specials (excluding Røkkr area-of-effect Specials) by percentage = difference between stats × 4 (max 40%).")

const CloseDef3 = new FEH.PassiveSkill().setSlot("A").setName("Close Def 3").setDescription("If foe initiates combat and uses sword, lance, axe, dragonstone, or beast damage, grants Def/Res+6 during combat.");

CloseDef3.onDefense = ({ wielder, enemy }) => {
    if (enemy.getWeapon().range === 1) {
        wielder.setBattleMods({
            def: 6,
            res: 6
        });
    }
};


const SwiftSparrow3 = new FEH.PassiveSkill().setName("Swift Sparrow 3").setSlot("A").setDescription("If unit initiates combat, grants Atk+6, Spd+7 during combat.");

SwiftSparrow3.onInitiate = ({ wielder }) => {
    wielder.setBattleMods({
        atk: 6,
        spd: 6
    });
};

const OstiasPulse2 = new FEH.PassiveSkill().setName("Ostia's Pulse II").setSlot("C").setDescription("At start of turn, grants Def/Res+6 to unit and allies for one turn, and also, if any unit or ally's Special cooldown count is at its maximum value, grants them Special cooldown count-1. All effects granted only if the number of that unit or ally's movement type on the current team is ≤ 2.");

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

const Windsweep3 = new FEH.PassiveSkill().setName("Windsweep 3").setSlot("B").setDescription("If unit initiates combat, unit cannot make a follow-up attack. If unit's Spd > foe's Spd and foe uses sword, lance, axe, bow, dagger, or beast damage, foe cannot counterattack.");

Windsweep3.onInitiate = ({ wielder, enemy }) => {
    wielder.lowerCursor("followup", 1);
    if (["sword", "lance", "axe", "dagger", "bow", "beast"].includes(enemy.getWeapon().type)) {
        enemy.lowerCursor("counterattack", 1);
    }
};

Windsweep3.setDescription("If unit initiates combat, unit cannot make a follow-up attack. If unit's Spd > foe's Spd and foe uses sword, lance, axe, bow, dagger, or beast damage, foe cannot counterattack.")

const AtkSpdBond4 = new FEH.PassiveSkill().setName("Atk/Spd Bond 4").setSlot("S").setDescription("If unit is adjacent to an ally, grants Atk/Spd+7 to unit and neutralizes unit's penalties to Atk/Spd during combat.");

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

const NullFollowUp3 = new FEH.PassiveSkill().setName("Null Follow-Up 3").setSlot("B").setDescription("Neutralizes effects that guarantee foe's follow-up attacks and effects that prevent unit's follow-up attacks during combat.");

NullFollowUp3.onBeforeCombat = ({ wielder }) => {
    wielder.raiseCursor("followup", 1);
};

const Swordbreaker3 = new FEH.PassiveSkill().setName("Swordbreaker 3").setSlot("B").setDescription("If unit's HP ≥ 50% in combat against a sword foe, unit makes a guaranteed follow-up attack and foe cannot make a follow-up attack.");

Swordbreaker3.onBeforeCombat = ({ wielder, enemy }) => {
    if (enemy.getWeapon().type === "sword") {
        wielder.raiseCursor("followup", 1);
        enemy.lowerCursor("followup", 1);
    }
};

const AtkDefSolo4 = new FEH.PassiveSkill().setName("Atk/Def Solo 4").setSlot("S").setDescription("If unit is not adjacent to an ally, grants Atk/Def+7 during combat.");

AtkDefSolo4.onBeforeCombat = ({ wielder }) => {
    for (let ally of wielder.allies) {
        if (wielder.getDistance(ally) === 1) return;
    }

    wielder.setBattleMods({
        atk: 7,
        def: 7,
    });
};

const SpdSmoke3 = new FEH.PassiveSkill().setName("Spd Smoke 3").setSlot("S").setDescription("Inflicts Spd-7 on foes within 2 spaces of target through their next actions after combat.");
const AtkSmoke3 = new FEH.PassiveSkill().setName("Atk Smoke 3").setSlot("C").setDescription("Inflicts Atk-7 on foes within 2 spaces of target through their next actions after combat.");
const ResSmoke3 = new FEH.PassiveSkill().setName("Res Smoke 3").setSlot("S").setDescription("Inflicts Res-7 on foes within 2 spaces of target through their next actions after combat.");
const HoneSpd2 = new FEH.PassiveSkill().setName("Hone Spd 2").setSlot("C").setDescription("At start of turn, grants Spd+4 to adjacent allies for 1 turn.");
const ArmorMarch3 = new FEH.PassiveSkill().setName("Armor March 3").setSlot("S").setDescription("At start of turn, if unit is adjacent to an armored ally, unit and adjacent armored allies can move 1 extra space. (That turn only. Does not stack.)");
const SpecialFighter3 = new FEH.PassiveSkill().setName("Special Fighter 3").setSlot("B").setDescription("At start of combat, if unit's HP ≥ 50%, grants Special cooldown charge +1 to unit and inflicts Special cooldown charge -1 on foe per attack. (Only highest value applied. Does not stack.)");

AtkSmoke3.onAfterCombat = ({ enemy }) => {
    let effects: Effect[] = [];
    for (let ally of enemy.allies) {
        if (enemy.getDistance(ally) <= 2) {
            effects.push({
                targetHeroId: ally.id,
                appliedEffect: {
                    stats: {
                        atk: -7,
                    }
                }
            });
        }
    }
    return effects;
};

ResSmoke3.onAfterCombat = ({ enemy }) => {
    let effects: Effect[] = [];
    for (let ally of enemy.allies) {
        if (enemy.getDistance(ally) <= 2) {
            effects.push({
                targetHeroId: ally.id,
                appliedEffect: {
                    stats: {
                        res: -7,
                    }
                }
            });
        }
    }
    return effects;
};

SpdSmoke3.onAfterCombat = ({ enemy }) => {
    let effects: Effect[] = [];
    for (let ally of enemy.allies) {
        if (enemy.getDistance(ally) <= 2) {
            effects.push({
                targetHeroId: ally.id,
                appliedEffect: {
                    stats: {
                        spd: -7,
                    }
                }
            });
        }
    }
    return effects;
};

HoneSpd2.onTurnStart = ({ wielder }) => {
    let effects: Effect[] = [];
    for (let ally of wielder.allies) {
        if (wielder.getDistance(ally) === 1) {
            effects.push({
                targetHeroId: ally.id,
                appliedEffect: {
                    stats: {
                        spd: 4
                    }
                }
            });
        }
    }

    return effects;
};


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

    resetEffects(team: "team1" | "team2") {
        for (let { hero } of this[team]) {
            hero.mapMods = {
                atk: 0,
                spd: 0,
                res: 0,
                def: 0,
            };
            hero.statuses = [];
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

    killHero(hero: Hero) {
        for (let ally of hero.allies) {
            ally.allies = ally.allies.filter(({ id }) => id !== hero.id);
        }
        for (let enemy of hero.enemies) {
            enemy.enemies = enemy.enemies.filter(({ id }) => id !== hero.id);
        }
        this.team1 = this.team1.filter(({ hero: teamMember }) => teamMember.id !== hero.id);
        this.team2 = this.team2.filter(({ hero: teamMember }) => teamMember.id !== hero.id);
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

    getTurnStartEffects(team: "team1" | "team2") {
        return this.effectRunner.runTurnStartEffects(team);
    }

    getPostCombatEffects(hero: Hero, enemy: Hero, combatOutcome: CombatOutcome) {
        return this.effectRunner.runAfterCombatEffects({
            hero,
            enemy,
            combatOutcome
        });
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
    y: 7,
    x: 5
});

battle.setAlliesAndEnemies();

export default battle;
