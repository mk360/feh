import SOCKET from "../default-socket";

interface SkillLogProperties {
    sourceSkill: string;
    sourceEntity: string;
    targetEntity: string;
}

let lastLogContainer = document.getElementById("battle-log");

interface CombatModLog extends SkillLogProperties {
    brave: boolean;
    followupEnabled: boolean;
    extraDamage: number;
    healed: number;
};

interface CombatLog {
    logType: "combat";
    rounds: CombatRoundLog[];
    attacker: {
        id: string;
        mods: CombatModLog[];
    };
    defender: {
        id: string;
        mods: CombatModLog[];
    };
}

interface CombatRoundLog {
    round: number;
    attacker: {
        id: string;
        damage: number;
        activatedSpecial: boolean;
        newSpecialCooldown: number;
    };
    defender: {
        id: string;
        activatedSpecial: boolean;
        healed: number;
        newSpecialCooldown: number;
    };
};

interface MapDamageLog extends SkillLogProperties {
    logType: "MapDamage";
    damage: number;
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

interface StatusLog extends SkillLogProperties {
    logType: "Status";
    status: string;
}

type LogPayload = CombatBuffLog | CombatDebuffLog | BonusLog | PenaltyLog | CombatLog | StatusLog | MapDamageLog;

interface LoggableHeroData {
    id: string;
    name: string;
    teamId: string;
}

function bindLoggerSocket(teamId: string, units: LoggableHeroData[]) {
    SOCKET.on("history", (payload: LogPayload[]) => {
        console.log({ payload });
        for (let item of payload) {
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
                    if (changeString) appendToLog(entry);
                    break;
                }

                case "Status": {
                    const targetEntity = printCharacterName(teamId, units, item.targetEntity);
                    const sourceEntity = printCharacterName(teamId, units, item.targetEntity);
                    const addsStatus = document.createElement("span");
                    addsStatus.innerText = ` gave the status ${item.status} to`;
                    const sourceSkill = document.createElement("span");
                    sourceSkill.innerText = `'s ${item.sourceSkill}`;
                    const entry = document.createElement("div");
                    entry.appendChild(sourceEntity);
                    entry.appendChild(sourceSkill);
                    entry.appendChild(addsStatus);
                    entry.appendChild(targetEntity);
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
                    entry.classList.add("log-entry");
                    entry.appendChild(sourceEntity);

                    const sourceSkill = document.createElement("span");
                    sourceSkill.innerText = `'s ${item.sourceSkill}.`;
                    entry.appendChild(sourceSkill);
                    if (changeString) appendToLog(entry);
                    break;
                }

                case "CombatBuff": {
                    const changeString = createStatsString(item.buffs);
                    const targetEntity = printCharacterName(teamId, units, item.targetEntity);
                    const sourceEntity = printCharacterName(teamId, units, item.sourceEntity);
                    const entry = document.createElement("div");
                    entry.classList.add("log-entry");
                    entry.appendChild(targetEntity);

                    const receives = document.createElement("span");
                    receives.innerText = ` receives ${changeString} from `;
                    entry.appendChild(receives);
                    entry.appendChild(sourceEntity);

                    const sourceSkill = document.createElement("span");
                    sourceSkill.innerText = `'s ${item.sourceSkill}.`;
                    entry.appendChild(sourceSkill);
                    if (changeString) appendToLog(entry);
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
                    entry.classList.add("log-entry");
                    entry.appendChild(sourceSkill);
                    if (changeString) appendToLog(entry);
                    break;
                }

                case "PreventFollowup": {
                    // const targetEntity = printCharacterName(teamId, units, item.targetEntity);
                    const prevented = document.createElement("span");
                    prevented.innerText = ` prevented the opponent from performing a follow-up attack.`;
                    console.log(units);
                    const sourceEntity = printCharacterName(teamId, units, item.sourceEntity);
                    const entry = document.createElement("div");
                    // entry.appendChild(targetEntity);
                    const sourceSkill = document.createElement("span");
                    sourceSkill.innerText = `'s ${item.sourceSkill}`;
                    entry.classList.add("log-entry");
                    entry.appendChild(sourceEntity);
                    entry.appendChild(sourceSkill);
                    entry.appendChild(prevented);
                    // entry.appendChild(targetEntity);
                    appendToLog(entry);
                    break;
                }

                case "GuaranteedFollowup": {
                    const sourceEntity = printCharacterName(teamId, units, item.sourceEntity);
                    const guaranteed = document.createElement("span");
                    guaranteed.innerText = ` gets a guaranteed follow-up attack from `;
                    const sourceSkill = document.createElement("span");
                    sourceSkill.innerText = item.sourceSkill;
                    const entry = document.createElement("div");
                    entry.classList.add("log-entry");
                    entry.appendChild(sourceEntity);
                    entry.appendChild(guaranteed);
                    entry.appendChild(sourceSkill);
                    appendToLog(entry);
                    break;
                }
            }
        }
    });
};

function appendToLog(item: HTMLDivElement) {
    lastLogContainer.appendChild(item);
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
