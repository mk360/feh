import Hero from "feh-battles/dec/hero";
import Coords from "./coords";
import { CombatOutcome } from "feh-battles/dec/combat";
import Team from "../types/team";

interface CancelAction {
    type: "cancel";
    args: Coords & { hero: Hero };
};

interface MoveAction {
    type: "move";
    args: Coords & { hero: Hero };
};

interface AttackAction {
    type: "attack";
    args: {
        attacker: Hero;
        defender: Hero;
        outcome: CombatOutcome;
    }
}

interface DisableAction {
    type: "disable",
    args: Hero;
}

interface PreviewBattleAction {
    type: "preview",
    args: {
        attacker: Hero;
        defender: Hero;
        outcome: CombatOutcome;
    };
}

interface SwitchTeammatesAction {
    type: "switch",
    args: {
        firstHero: Hero;
        secondHero: Hero;
    };
};

interface StartTurnAction {
    type: "start-turn",
    args: {
        turn: Team;
        turnCount: number;
    }
}

interface SwapSpacesAction {
    type: "swap-spaces";
}

interface DisplayEnemyRangeAction {
    type: "display-enemy-range";
    enabled: boolean;
}

type UIAction = SwapSpacesAction | DisplayEnemyRangeAction | AttackAction | MoveAction | CancelAction | DisableAction | PreviewBattleAction | SwitchTeammatesAction | StartTurnAction;

export default UIAction;
