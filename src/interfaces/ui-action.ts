import Hero from "feh-battles/dec/hero";
import Coords from "./coords";
import { CombatOutcome } from "feh-battles/dec/combat";

interface CancelAction {
    type: "cancel";
    args: Coords;
};

interface MoveAction {
    type: "move";
    args: Coords;
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
}

type UIAction = AttackAction | MoveAction | CancelAction | DisableAction | PreviewBattleAction | SwitchTeammatesAction;

export default UIAction;
