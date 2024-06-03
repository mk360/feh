[{
    type: "attack",
    attacker: "machin",
    target: "machin2"
}, {
    type: "attack",
    "attacker": "machin2",
    "defender": "machin",
    ["machin2"]: {
        heal: 20,
        activateSpecial: true,
    },
    "machin": {
        activateSpecial: true,
    }
}, {
    type: "after-combat",
    ["machin2"]: {
        damage: 8,
    },
}, {
    type: "status",
    "machin3": ["debuff"],
    "machin4": ["debuff aussi"],
    "machin2": ["buff hahaha omg je suis trop fort xoxo uwu"]
}]

/**
 * Au départ, fais bouger le personnage (l'animation doit durer 300 ms)
 * 100ms plus tard, si le spécial est prêt, lance l'animation du spécial (qui sera définie ailleurs)
 * 200ms plus tard, s'il y a restauration de PV, lance l'animation de restauration de PV
 * 0 ms plus tard, fais l'animation de dégâts
 * rinse and repeat pour le reste des tours ??
 */