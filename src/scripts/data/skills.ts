import { Effect } from "feh-battles/dec/base_skill";
import FEH from "feh-battles";
import Hero from "feh-battles/dec/hero";
import Stats from "../../interfaces/stats";

export const Astra = new FEH.Special({
    name: "Astra",
    description: "Increases damage by 150%",
    cooldown: 5
});

export const Shove = new FEH.Assist({
    name: "Shove",
    description: "Pushes target ally one space away.",
    range: 1
});

export const Mulagir = new FEH.Weapon();
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

export const Ragnell = new FEH.Weapon();
Ragnell.setType("sword").setColor("red").setMight(16).setName("Ragnell");

Ragnell.setDescription("Unit can counterattack regardless of range.");

Ragnell.onDefense = (effect) => {
    effect.wielder.raiseCursor("counterattack", 1);
};

export const DraconicRage = new FEH.Weapon({
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

export const Expiration = new FEH.Weapon({
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

export const Geirskogul = new FEH.Weapon({
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

export const ThunderArmads = new FEH.Weapon({
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

export const Garm = new FEH.Weapon();
Garm.setName("Garm").setType("axe").setColor("green").setMight(16).setRange(1).setDescription("Grants Atk+3. If a bonus granted by a skill like Rally or Hone and/or 1 extra space of movement granted by a skill like Armor March or Armored Boots is active, unit makes a guaranteed follow-up attack.");

Garm.onEquip = (wielder) => {
    wielder.raiseStat("atk", 3);
};

Garm.onBeforeCombat = ({ wielder }) => {
    if (wielder.statuses.length) {
        wielder.raiseCursor("followup", 1);
    }
};

export const Raijinto = new FEH.Weapon({
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

export const DistantCounter = new FEH.PassiveSkill();
DistantCounter.setName("Distant Counter");
DistantCounter.setSlot("A");
DistantCounter.onDefense = ({ wielder }) => {
    wielder.raiseCursor("counterattack", 1);
}

DistantCounter.setDescription("Unit can counterattack regardless of foe's range.");

export const VengefulFighter3 = new FEH.PassiveSkill();
VengefulFighter3.setName("Vengeful Fighter 3");
VengefulFighter3.setSlot("B");

VengefulFighter3.setDescription("If unit's HP ≥ 50% and foe initiates combat, grants Special cooldown charge +1 per unit's attack, and unit makes a guaranteed follow-up attack. (Does not stack.)")

VengefulFighter3.onDefense = ({ wielder }) => {
    if (wielder.stats.hp / wielder.maxHP >= 0.5) {
        wielder.raiseCursor("followup", 1);
    }
}

export const Dragonskin = new FEH.PassiveSkill();
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

export const SturdyBlow2 = new FEH.PassiveSkill().setName("Sturdy Blow 2").setSlot("A").setDescription("If unit initiates combat, grants Atk/Def+4 during combat.");

SturdyBlow2.onInitiate = ({ wielder }) => {
    wielder.setBattleMods({
        atk: 4,
        def: 4
    });
};

export const DriveSpd2 = new FEH.PassiveSkill().setName("Drive Spd 2").setSlot("C").setDescription("Grants Spd+3 to allies within 2 spaces during combat.");

DriveSpd2.onBeforeAllyCombat = ({ ally, wielder }) => {
    if (wielder.getDistance(ally) <= 2) {
        ally.setBattleMods({
            spd: 3
        });
    }
};

export const AtkResBond3 = new FEH.PassiveSkill().setDescription("If unit is adjacent to an ally, grants Atk/Res+5 during combat.");
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

export const AtkDefBond3 = new FEH.PassiveSkill();
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

export const AtkResForm3 = new FEH.PassiveSkill().setName("Atk/Res Form 3").setSlot("S").setDescription("If unit is within 2 spaces of an ally, grants Atk/Res+X to unit during combat (X = 2 × number of allies within 2 spaces, + 1; max 7).");
export const SacaesBlessing = new FEH.PassiveSkill().setName("Sacae's Blessing").setSlot("B");

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

export const SpdResRein3 = new FEH.PassiveSkill().setName("Spd/Res Rein 3").setSlot("C").setDescription("Inflicts Spd/Res-4 on foes within 2 spaces during combat.");

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

export const KestrelStance2 = new FEH.PassiveSkill().setName("Kestrel Stance 2").setSlot("A").setDescription("If foe initiates combat, grants Atk/Spd+4 during combat.");

KestrelStance2.onDefense = ({ wielder }) => {
    wielder.setBattleMods({
        atk: 4,
        spd: 4,
    });
};

export const AtkSpdRein3 = new FEH.PassiveSkill().setName("Atk/Spd Rein 3").setSlot("C").setDescription("Inflicts Atk/Spd-4 on foes within 2 spaces during combat.");

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

export const WardingBreath = new FEH.PassiveSkill().setName("Warding Breath").setSlot("A");

WardingBreath.onDefense = ({ wielder }) => {
    wielder.setBattleMods({
        res: 4
    });
};

WardingBreath.setDescription("If foe initiates combat, grants Res+4 during combat and Special cooldown charge +1 per attack. (Only highest value applied. Does not stack.)")

export const JointDriveRes = new FEH.PassiveSkill().setName("Joint Drive Res").setSlot("C");

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

export const SealAtkDef2 = new FEH.PassiveSkill().setName("Seal Atk/Def 2").setSlot("B");

SealAtkDef2.onAfterCombat = ({ enemy, wielder }) => {
    const targetEnemies = enemy.allies.filter((ally) => ally.getDistance(enemy) <= 2);
    return [];
};

SealAtkDef2.setDescription("Inflicts Atk/Def-5 on foe through its next action after combat.");

export const Bushido2 = new FEH.PassiveSkill().setName("Bushido II").setSlot("B");

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

export const CloseDef3 = new FEH.PassiveSkill().setSlot("A").setName("Close Def 3").setDescription("If foe initiates combat and uses sword, lance, axe, dragonstone, or beast damage, grants Def/Res+6 during combat.");

CloseDef3.onDefense = ({ wielder, enemy }) => {
    if (enemy.getWeapon().range === 1) {
        wielder.setBattleMods({
            def: 6,
            res: 6
        });
    }
};


export const SwiftSparrow3 = new FEH.PassiveSkill().setName("Swift Sparrow 3").setSlot("A").setDescription("If unit initiates combat, grants Atk+6, Spd+7 during combat.");

SwiftSparrow3.onInitiate = ({ wielder }) => {
    wielder.setBattleMods({
        atk: 6,
        spd: 6
    });
};

export const OstiasPulse2 = new FEH.PassiveSkill().setName("Ostia's Pulse II").setSlot("C").setDescription("At start of turn, grants Def/Res+6 to unit and allies for one turn, and also, if any unit or ally's Special cooldown count is at its maximum value, grants them Special cooldown count-1. All effects granted only if the number of that unit or ally's movement type on the current team is ≤ 2.");

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

export const Windsweep3 = new FEH.PassiveSkill().setName("Windsweep 3").setSlot("B").setDescription("If unit initiates combat, unit cannot make a follow-up attack. If unit's Spd > foe's Spd and foe uses sword, lance, axe, bow, dagger, or beast damage, foe cannot counterattack.");

Windsweep3.onInitiate = ({ wielder, enemy }) => {
    wielder.lowerCursor("followup", 1);
    if (["sword", "lance", "axe", "dagger", "bow", "beast"].includes(enemy.getWeapon().type)) {
        enemy.lowerCursor("counterattack", 1);
    }
};

Windsweep3.setDescription("If unit initiates combat, unit cannot make a follow-up attack. If unit's Spd > foe's Spd and foe uses sword, lance, axe, bow, dagger, or beast damage, foe cannot counterattack.")

export const AtkSpdBond4 = new FEH.PassiveSkill().setName("Atk/Spd Bond 4").setSlot("S").setDescription("If unit is adjacent to an ally, grants Atk/Spd+7 to unit and neutralizes unit's penalties to Atk/Spd during combat.");

AtkSpdBond4.onBeforeCombat = ({ wielder }) => {
    for (let ally of wielder.allies) {
        if (wielder.getDistance(ally) === 1) {
            const statsBuffs: Partial<Stats> = {
                atk: 7,
                spd: 7,
            };
            for (let stat in wielder.mapBoosts) {
                if (wielder.mapBoosts[stat] < 0) {
                    statsBuffs[stat] += -wielder.mapBoosts[stat];
                    wielder.mapBoosts[stat] = 0;
                }
            }
            wielder.setBattleMods(statsBuffs);
            return;
        }
    }
};

export const NullFollowUp3 = new FEH.PassiveSkill().setName("Null Follow-Up 3").setSlot("B").setDescription("Neutralizes effects that guarantee foe's follow-up attacks and effects that prevent unit's follow-up attacks during combat.");

NullFollowUp3.onBeforeCombat = ({ wielder }) => {
    wielder.raiseCursor("followup", 1);
};

export const Swordbreaker3 = new FEH.PassiveSkill().setName("Swordbreaker 3").setSlot("B").setDescription("If unit's HP ≥ 50% in combat against a sword foe, unit makes a guaranteed follow-up attack and foe cannot make a follow-up attack.");

Swordbreaker3.onBeforeCombat = ({ wielder, enemy }) => {
    if (enemy.getWeapon().type === "sword") {
        wielder.raiseCursor("followup", 1);
        enemy.lowerCursor("followup", 1);
    }
};

export const AtkDefSolo4 = new FEH.PassiveSkill().setName("Atk/Def Solo 4").setSlot("S").setDescription("If unit is not adjacent to an ally, grants Atk/Def+7 during combat.");

AtkDefSolo4.onBeforeCombat = ({ wielder }) => {
    for (let ally of wielder.allies) {
        if (wielder.getDistance(ally) === 1) return;
    }

    wielder.setBattleMods({
        atk: 7,
        def: 7,
    });
};

export const SpdSmoke3 = new FEH.PassiveSkill().setName("Spd Smoke 3").setSlot("S").setDescription("Inflicts Spd-7 on foes within 2 spaces of target through their next actions after combat.");
export const AtkSmoke3 = new FEH.PassiveSkill().setName("Atk Smoke 3").setSlot("C").setDescription("Inflicts Atk-7 on foes within 2 spaces of target through their next actions after combat.");
export const ResSmoke3 = new FEH.PassiveSkill().setName("Res Smoke 3").setSlot("S").setDescription("Inflicts Res-7 on foes within 2 spaces of target through their next actions after combat.");
export const HoneSpd2 = new FEH.PassiveSkill().setName("Hone Spd 2").setSlot("C").setDescription("At start of turn, grants Spd+4 to adjacent allies for 1 turn.");
export const ArmorMarch3 = new FEH.PassiveSkill().setName("Armor March 3").setSlot("S").setDescription("At start of turn, if unit is adjacent to an armored ally, unit and adjacent armored allies can move 1 extra space. (That turn only. Does not stack.)");
export const SpecialFighter3 = new FEH.PassiveSkill().setName("Special Fighter 3").setSlot("B").setDescription("At start of combat, if unit's HP ≥ 50%, grants Special cooldown charge +1 to unit and inflicts Special cooldown charge -1 on foe per attack. (Only highest value applied. Does not stack.)");

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