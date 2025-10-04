interface SkillLogProperties {
    sourceSkill: string;
    sourceEntity: string;
    targetEntity: string;
    preview: boolean;
}


interface CombatModLog extends SkillLogProperties {
    brave: boolean;
    followupEnabled: boolean;
    extraDamage: number;
    healed: number;
};

interface CombatLog extends SkillLogProperties {
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

interface MapBuffLog extends SkillLogProperties {
    logType: "MapBuff";
    bonuses: {
        [k in "atk" | "def" | "spd" | "res"]: number;
    };
};

interface NewTurnLog extends SkillLogProperties {
    logType: "turn";
    count: number;
    side: string;
}

interface GuaranteedFollowupLog extends SkillLogProperties {
    logType: "GuaranteedFollowup";
};

interface PreventFollowupLog extends SkillLogProperties {
    logType: "PreventFollowup";
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

interface RefreshLog extends SkillLogProperties {
    logType: "Refresh";
};

export type LogPayload = CombatBuffLog | CombatDebuffLog | MapBuffLog | PenaltyLog | CombatLog | StatusLog | MapDamageLog | NewTurnLog | GuaranteedFollowupLog | PreventFollowupLog | RefreshLog;