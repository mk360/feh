import SOCKET from "../default-socket";

interface SkillLogProperties {
    sourceSkill: string;
    sourceEntity: string;
    targetEntity: string;
}

let lastLogContainer = document.createElement("div");
document.getElementById("battle-log").appendChild(lastLogContainer);

interface CombatModLog extends SkillLogProperties {
    brave: boolean;
    followupEnabled: boolean;
    extraDamage: number;
    healed: number;
};

interface CombatRoundLog {
    logType: "combat-round";
    round: number;
    attacker: {
        id: string;
        damage: number;
        activatedSpecial: boolean;
        mods: CombatModLog[];
        newSpecialCooldown: number;
    };
    defender: {
        id: string;
        activatedSpecial: boolean;
        healed: number;
        mods: CombatModLog[];
        newSpecialCooldown: number;
    };
};

interface CombatBuffLog extends SkillLogProperties {
    logType: "CombatBuff";
    buffs: {
        [k in "atk" | "def" | "spd" | "res"]: number;
    };
};

interface CombatDebuffLog extends SkillLogProperties {
    logType: "combat-debuff";
    debuffs: {
        [k in "atk" | "def" | "spd" | "res"]: number;
    };
};

interface BonusLog extends SkillLogProperties {
    logType: "bonus";
    bonuses: {
        [k in "atk" | "def" | "spd" | "res"]: number;
    };
};

interface PenaltyLog extends SkillLogProperties {
    logType: "penalty";
    penalties: {
        [k in "atk" | "def" | "spd" | "res"]: number;
    };
};

type LogPayload = CombatBuffLog | CombatDebuffLog | BonusLog | PenaltyLog | CombatRoundLog;

interface LoggableHeroData {
    id: string;
    name: string;
    teamId: string;
}

function bindLoggerSocket(teamId: string, units: LoggableHeroData[]) {
    SOCKET.on("history", (payload: LogPayload[]) => {
        for (let item of payload) {
            console.log({ item });
            switch (item.logType) {
                case "bonus": {
                    const changeString = createStatsString(item.bonuses);
                    const targetEntity = printCharacterName(teamId, units, item.targetEntity);
                    const sourceEntity = printCharacterName(teamId, units, item.sourceEntity);
                    const entry = document.createElement("div");
                    entry.appendChild(targetEntity);

                    const receives = document.createElement("span");
                    receives.innerText = ` receives ${changeString} from `;
                    entry.appendChild(receives);
                    entry.appendChild(sourceEntity);

                    const sourceSkill = document.createElement("span");
                    sourceSkill.innerText = `'s ${item.sourceSkill}.`;
                    entry.appendChild(sourceSkill);
                    appendToLog(entry);
                    break;
                }

                case "penalty": {
                    const changeString = createStatsString(item.penalties);
                    const targetEntity = printCharacterName(teamId, units, item.targetEntity);
                    const sourceEntity = printCharacterName(teamId, units, item.sourceEntity);
                    const entry = document.createElement("div");
                    entry.appendChild(targetEntity);

                    const receives = document.createElement("span");
                    receives.innerText = ` receives ${changeString} from `;
                    entry.appendChild(receives);
                    entry.appendChild(sourceEntity);

                    const sourceSkill = document.createElement("span");
                    sourceSkill.innerText = `'s ${item.sourceSkill}.`;
                    entry.appendChild(sourceSkill);
                    appendToLog(entry);
                    break;
                }

                case "CombatBuff": {
                    console.log({ teamId, units, source: item.sourceEntity })
                    const changeString = createStatsString(item.buffs);
                    const targetEntity = printCharacterName(teamId, units, item.targetEntity);
                    const sourceEntity = printCharacterName(teamId, units, item.sourceEntity);
                    const entry = document.createElement("div");
                    entry.appendChild(targetEntity);

                    const receives = document.createElement("span");
                    receives.innerText = ` receives ${changeString} from `;
                    entry.appendChild(receives);
                    entry.appendChild(sourceEntity);

                    const sourceSkill = document.createElement("span");
                    sourceSkill.innerText = `'s ${item.sourceSkill}.`;
                    entry.appendChild(sourceSkill);
                    appendToLog(entry);
                    break;
                }

                case "combat-debuff": {
                    const changeString = createStatsString(item.debuffs);
                    const targetEntity = printCharacterName(teamId, units, item.targetEntity);
                    const sourceEntity = printCharacterName(teamId, units, item.sourceEntity);
                    const entry = document.createElement("div");
                    entry.appendChild(targetEntity);

                    const receives = document.createElement("span");
                    receives.innerText = ` receives ${changeString} from `;
                    entry.appendChild(receives);
                    entry.appendChild(sourceEntity);

                    const sourceSkill = document.createElement("span");
                    sourceSkill.innerText = `'s ${item.sourceSkill}.`;
                    entry.appendChild(sourceSkill);
                    appendToLog(entry);
                    break;
                }

                case "combat-round": {

                }
            }
        }
    });
};

function appendToLog(item: HTMLDivElement) {
    if (lastLogContainer.parentNode.lastChild === lastLogContainer) {
        lastLogContainer.appendChild(item);
    } else {
        lastLogContainer = document.createElement("div");
        lastLogContainer.appendChild(item);
    }
}

function createStatsString(stats: {
    [k in "atk" | "def" | "spd" | "res"]: number;
}) {
    let strings: string[] = [];
    if (stats.atk) {
        const changeString = stats.atk > 0 ? `+${stats.atk}` : stats.atk;
        strings.push(`Atk${changeString}`);
    }

    if (stats.spd) {
        const changeString = stats.spd > 0 ? `+${stats.spd}` : stats.spd;
        strings.push(`Spd${changeString}`);
    }

    if (stats.def) {
        const changeString = stats.def > 0 ? `+${stats.def}` : stats.def;
        strings.push(`Def${changeString}`);
    }

    if (stats.res) {
        const changeString = stats.res > 0 ? `+${stats.res}` : stats.res;
        strings.push(`Res${changeString}`);
    }

    return strings.join(", ");
};

function printCharacterName(teamId: string, units: LoggableHeroData[], unitId: string) {
    const span = document.createElement("span");
    console.log(unitId);
    const unitData = units.find((unit) => unit.id === unitId);
    const isSameTeam = teamId === unitData.teamId;
    const b = document.createElement("b");
    span.appendChild(b);
    b.innerText = unitData.name;
    b.style.color = isSameTeam ? "#54DFF4" : "#FA4D69";
    return span;
};

export default bindLoggerSocket;
