import SOCKET from "../default-socket";
import { LogPayload } from "./interfaces";
let lastLogContainer = document.getElementById("battle-log-content");

interface LoggableHeroData {
    id: string;
    name: string;
    teamId: string;
}

function bindLoggerSocket(teamId: string, units: LoggableHeroData[]) {
    SOCKET.on("history", (payload: LogPayload[]) => {
        for (let item of payload) {
            const entry = document.createElement("div");
            entry.classList.add("log-entry");
            if (!item.preview) {
                entry.classList.add("standalone");
            }

            switch (item.logType) {
                case "MapBuff": {
                    if (!item.preview) {

                    }
                    const changeString = createStatsString(item.bonuses);
                    const targetEntity = printCharacterName(teamId, units, item.targetEntity);
                    const isSameTeam = units.find((i) => i.id === item.sourceEntity).teamId === teamId;
                    entry.classList.add(isSameTeam ? "ally" : "enemy");
                    const sourceEntity = printCharacterName(teamId, units, item.sourceEntity);
                    entry.appendChild(targetEntity);

                    const receives = document.createElement("span");
                    receives.innerText = ` receives ${changeString} from `;
                    entry.appendChild(receives);
                    entry.appendChild(sourceEntity);

                    const sourceSkill = document.createElement("span");
                    sourceSkill.innerText = `'s ${item.sourceSkill}.`;
                    entry.appendChild(sourceSkill);
                    if (changeString) appendToLog(entry, item.preview);
                    break;
                }

                case "Status": {
                    const targetEntity = printCharacterName(teamId, units, item.targetEntity);
                    const sourceEntity = printCharacterName(teamId, units, item.sourceEntity);
                    const isSameTeam = units.find((i) => i.id === item.sourceEntity).teamId === teamId;
                    entry.classList.add(isSameTeam ? "ally" : "enemy");
                    const addsStatus = document.createElement("span");
                    addsStatus.innerText = ` gave the ${item.status} status to `;
                    const sourceSkill = document.createElement("span");
                    sourceSkill.innerText = `'s ${item.sourceSkill}`;
                    entry.appendChild(sourceEntity);
                    entry.appendChild(sourceSkill);
                    entry.appendChild(addsStatus);
                    entry.appendChild(targetEntity);
                    appendToLog(entry, item.preview);
                    break;
                }

                case "penalty": {
                    const changeString = createStatsString(item.penalties);
                    const targetEntity = printCharacterName(teamId, units, item.targetEntity);
                    const sourceEntity = printCharacterName(teamId, units, item.sourceEntity);
                    entry.appendChild(targetEntity);

                    const receives = document.createElement("span");
                    receives.innerText = ` receives ${changeString} from `;
                    entry.appendChild(receives);
                    entry.classList.add("log-entry");
                    entry.appendChild(sourceEntity);

                    const isSameTeam = units.find((i) => i.id === item.sourceEntity).teamId === teamId;
                    entry.classList.add(isSameTeam ? "ally" : "enemy");

                    const sourceSkill = document.createElement("span");
                    sourceSkill.innerText = `'s ${item.sourceSkill}.`;
                    entry.appendChild(sourceSkill);
                    if (changeString) appendToLog(entry, item.preview);
                    break;
                }

                case "CombatBuff": {
                    const changeString = createStatsString(item.buffs);
                    const targetEntity = printCharacterName(teamId, units, item.targetEntity);
                    const sourceEntity = printCharacterName(teamId, units, item.sourceEntity);
                    entry.appendChild(targetEntity);

                    const receives = document.createElement("span");
                    receives.innerText = ` receives ${changeString} from `;
                    entry.appendChild(receives);
                    entry.appendChild(sourceEntity);

                    const isSameTeam = units.find((i) => i.id === item.sourceEntity).teamId === teamId;
                    entry.classList.add(isSameTeam ? "ally" : "enemy");

                    const sourceSkill = document.createElement("span");
                    sourceSkill.innerText = `'s ${item.sourceSkill}.`;
                    entry.appendChild(sourceSkill);
                    if (changeString) appendToLog(entry, item.preview);
                    break;
                }

                case "combat-debuff": {
                    const changeString = createStatsString(item.debuffs);
                    const targetEntity = printCharacterName(teamId, units, item.targetEntity);
                    const sourceEntity = printCharacterName(teamId, units, item.sourceEntity);
                    entry.appendChild(targetEntity);

                    const receives = document.createElement("span");
                    receives.innerText = ` receives ${changeString} from `;
                    entry.appendChild(receives);
                    entry.appendChild(sourceEntity);
                    const isSameTeam = units.find((i) => i.id === item.sourceEntity).teamId === teamId;
                    entry.classList.add(isSameTeam ? "ally" : "enemy");

                    const sourceSkill = document.createElement("span");
                    sourceSkill.innerText = `'s ${item.sourceSkill}.`;
                    entry.classList.add("log-entry");
                    entry.appendChild(sourceSkill);
                    if (changeString) appendToLog(entry, item.preview);
                    break;
                }

                case "Counterattack": {
                    const sourceEntity = printCharacterName(teamId, units, item.sourceEntity);
                    const targetEntity = printCharacterName(teamId, units, item.targetEntity);
                    const entry = document.createElement("div");
                    const sourceSkill = document.createElement("span");
                    sourceSkill.innerText = `'s ${item.sourceSkill}`;
                    entry.classList.add("log-entry");
                    const isSameTeam = units.find((i) => i.id === item.sourceEntity).teamId === teamId;
                    entry.classList.add(isSameTeam ? "ally" : "enemy");
                    const canCounterattack = document.createElement("span");
                    canCounterattack.innerHTML = ` can perform a counterattack from `;
                    entry.appendChild(targetEntity);
                    entry.appendChild(canCounterattack);
                    entry.appendChild(sourceEntity);
                    entry.appendChild(sourceSkill);
                    appendToLog(entry, item.preview);
                    break;
                }

                case "PreventFollowup": {
                    // const targetEntity = printCharacterName(teamId, units, item.targetEntity);
                    const prevented = document.createElement("span");
                    prevented.innerText = ` prevented the opponent from performing a follow-up attack.`;
                    const sourceEntity = printCharacterName(teamId, units, item.sourceEntity);
                    // entry.appendChild(targetEntity);
                    const sourceSkill = document.createElement("span");
                    sourceSkill.innerText = `'s ${item.sourceSkill}`;
                    entry.classList.add("log-entry");
                    entry.appendChild(sourceEntity);
                    entry.appendChild(sourceSkill);
                    entry.appendChild(prevented);
                    const isSameTeam = units.find((i) => i.id === item.sourceEntity).teamId === teamId;
                    entry.classList.add(isSameTeam ? "ally" : "enemy");
                    // entry.appendChild(targetEntity);
                    appendToLog(entry, item.preview);
                    break;
                }

                case "GuaranteedFollowup": {
                    const sourceEntity = printCharacterName(teamId, units, item.sourceEntity);
                    const guaranteed = document.createElement("span");
                    guaranteed.innerText = ` gets a guaranteed follow-up attack from `;
                    const sourceSkill = document.createElement("span");
                    sourceSkill.innerText = item.sourceSkill;
                    entry.appendChild(sourceEntity);
                    entry.appendChild(guaranteed);
                    entry.appendChild(sourceSkill);
                    const isSameTeam = units.find((i) => i.id === item.sourceEntity).teamId === teamId;
                    entry.classList.add(isSameTeam ? "ally" : "enemy");
                    appendToLog(entry, item.preview);
                    break;
                }

                case "turn": {
                    const container = document.createElement("div");
                    container.classList.add("log-entry");
                    const isSameTeam = item.side === teamId;
                    container.classList.add(isSameTeam ? "ally" : "enemy");
                    container.innerText = `Turn ${item.turn}: ${isSameTeam ? "Player Team" : "Enemy Team"}`;
                    appendToLog(container, false);
                    break;
                }

                case "Refresh": {
                    const sourceEntity = printCharacterName(teamId, units, item.sourceEntity);
                    const refreshed = document.createElement("span");
                    refreshed.innerText = ` granted another action to `;
                    entry.classList.add("log-entry");
                    const targetEntity = printCharacterName(teamId, units, item.targetEntity);
                    const isSameTeam = units.find((i) => i.id === item.sourceEntity).teamId === teamId;
                    entry.classList.add(isSameTeam ? "ally" : "enemy");
                    entry.appendChild(sourceEntity);
                    entry.appendChild(refreshed);
                    entry.appendChild(targetEntity);
                    appendToLog(entry, item.preview);
                    break;
                }

                case "DealDamage": {
                    const sourceEntity = printCharacterName(teamId, units, item.sourceEntity);
                    const targetEntity = printCharacterName(teamId, units, item.targetEntity);
                    const isSameTeam = units.find((i) => i.id === item.sourceEntity).teamId === teamId;
                    entry.classList.add(isSameTeam ? "ally" : "enemy");
                    break;
                };

                case "NormalizeStaffDamage": {
                    const sourceEntity = printCharacterName(teamId, units, item.sourceEntity);
                    const targetEntity = printCharacterName(teamId, units, item.targetEntity);
                    const sourceSkill = document.createElement("span");
                    sourceSkill.innerText = `'s ${item.sourceSkill}`;
                    const isSameTeam = units.find((i) => i.id === item.sourceEntity).teamId === teamId;
                    entry.classList.add("log-entry");
                    entry.classList.add(isSameTeam ? "ally" : "enemy");
                    const canCounterattack = document.createElement("span");
                    canCounterattack.innerHTML = `'s staff attacks suffer no penalty thanks to `;
                    entry.appendChild(targetEntity);
                    entry.appendChild(canCounterattack);
                    entry.appendChild(sourceEntity);
                    entry.appendChild(sourceSkill);
                    appendToLog(entry, item.preview);
                    break;
                }

                case "DealDamage": {
                    const isSameTeam = units.find((i) => i.id === item.sourceEntity).teamId === teamId;
                    entry.classList.add("log-entry");
                    entry.classList.add(isSameTeam ? "ally" : "enemy");
                    break;
                }

                default: {
                    entry.classList.add("unknown-message");
                    entry.innerText = `No configured message for log type ${item.logType}.`;
                    appendToLog(entry, item.preview);
                }
            }
        }
    });
};

const appendToLog = (item: HTMLDivElement, preview: boolean) => {
    const previewDivs = createPreviewContainer();
    if (preview) {
        previewDivs.previewContent.appendChild(item);
        lastLogContainer.appendChild(previewDivs.previewContainer);
        lastLogContainer.scrollTop = lastLogContainer.scrollHeight;
    } else {
        lastLogContainer.appendChild(item);
    }
};

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
    const unitData = units.find((unit) => unit.id === unitId);
    const isSameTeam = teamId === unitData.teamId;
    const b = document.createElement("b");
    span.appendChild(b);
    b.innerText = unitData.name;
    b.classList.add(isSameTeam ? "enemy" : "enemy");
    return span;
};

function createPreviewContainer() {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-single-log");
    deleteButton.innerText = "Delete";


    const previewHeader = document.createElement("div");
    previewHeader.classList.add("preview-header");
    const heading = document.createElement("h4");
    heading.innerText = "Preview";
    previewHeader.appendChild(heading);
    previewHeader.appendChild(deleteButton);
    const previewContent = document.createElement("div");

    const previewContainer = document.createElement("div");
    deleteButton.onclick = function () {
        lastLogContainer.removeChild(previewContainer);
    }
    previewContainer.classList.add("preview");
    previewContainer.appendChild(previewHeader);
    previewContainer.appendChild(previewContent);
    return {
        previewContainer, previewContent
    };
}

export default bindLoggerSocket;
