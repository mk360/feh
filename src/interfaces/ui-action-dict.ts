import Hero from "feh-battles/dec/hero";
import Coords from "./coords";
import { CombatOutcome } from "feh-battles/dec/combat";

interface UIActionDict {
    move: Coords;
    cancel: Coords;
    attack: {
        attacker: Hero;
        defender: Hero;
        outcome: CombatOutcome;
    }
};

export default UIActionDict;
