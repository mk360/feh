import FEH from "feh-battles";
import * as Skills from "./skills";

export const Ryoma = new FEH.Hero({
    name: "Ryoma",
    weaponColor: "red",
    weaponType: "sword",
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

export const Lyn = new FEH.Hero({
    name: "Lyn",
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

export const Ike = new FEH.Hero({
    name: "Ike",
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

export const Corrin = new FEH.Hero({
    name: "Corrin",
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
    weaponType: "breath",
    movementType: "infantry",
});

export const Lucina = new FEH.Hero({
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
        def: 40,
        res: 35
    },
    bane: "atk",
    boon: "def",
});

export const Robin = new FEH.Hero({
    name: "Robin",
    weaponColor: "colorless",
    weaponType: "breath",
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

export const Ephraim = new FEH.Hero({
    name: "Ephraim",
    weaponColor: "green",
    weaponType: "axe",
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

export const Hector = new FEH.Hero({
    name: "Hector",
    weaponColor: "green",
    weaponType: "axe",
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

Hector.equipSkill(Skills.DistantCounter);
Hector.equipSkill(Skills.VengefulFighter3);
Hector.setWeapon(Skills.ThunderArmads);
Hector.equipSkill(Skills.OstiasPulse2);
Hector.equipSkill(Skills.ArmorMarch3);

Skills.ArmorMarch3.slot = "C";

Corrin.setWeapon(Skills.DraconicRage);
Corrin.equipSkill(Skills.AtkDefBond3);
Corrin.equipSkill(Skills.AtkResForm3);
Corrin.equipSkill(Skills.NullFollowUp3);
Corrin.equipSkill(Skills.HoneSpd2);

Lucina.setWeapon(Skills.Geirskogul);
Lucina.equipSkill(Skills.SturdyBlow2);
Lucina.equipSkill(Skills.AtkSpdBond4);
Lucina.equipSkill(Skills.DriveSpd2);
Lucina.equipSkill(Skills.Windsweep3);

Ephraim.equipSkill(Skills.CloseDef3);
Ephraim.setWeapon(Skills.Garm);
Ephraim.equipSkill(Skills.AtkDefSolo4);
Ephraim.equipSkill(Skills.ArmorMarch3);
Ephraim.equipSkill(Skills.SpecialFighter3);

Robin.equipSkill(Skills.SpdResRein3);
Robin.setWeapon(Skills.Expiration);
Robin.equipSkill(Skills.Dragonskin);
Robin.equipSkill(Skills.ResSmoke3);
Robin.equipSkill(Skills.Swordbreaker3);

Lyn.setWeapon(Skills.Mulagir);
Lyn.equipSkill(Skills.SwiftSparrow3);
Lyn.equipSkill(Skills.SacaesBlessing);
Lyn.equipSkill(Skills.AtkSmoke3);
Lyn.equipSkill(Skills.SpdSmoke3);

Ryoma.setWeapon(Skills.Raijinto);
Ryoma.equipSkill(Skills.KestrelStance2);
Ryoma.equipSkill(Skills.AtkSpdRein3);
Ryoma.equipSkill(Skills.Bushido2);
Ryoma.equipSkill(Skills.SpdSmoke3);
Ryoma.equipSkill(Skills.Astra);
Ryoma.equipSkill(Skills.Shove);

Ike.setWeapon(Skills.Ragnell);
Ike.equipSkill(Skills.JointDriveRes);
Ike.equipSkill(Skills.WardingBreath);
Ike.equipSkill(Skills.SealAtkDef2);
Ike.equipSkill(Skills.AtkResForm3);