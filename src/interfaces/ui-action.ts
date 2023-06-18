import Hero from "feh-battles/dec/hero";
import Coords from "./coords";
import UIActionDict from "./ui-action-dict";
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

type UIAction = AttackAction | MoveAction | CancelAction | DisableAction;

export default UIAction;
