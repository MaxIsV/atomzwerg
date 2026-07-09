export default class Item {
    constructor(name, textureKey, damage, cooldown) {
        this.name = name;
        this.textureKey = textureKey;

        this.damage = damage
        this.cooldown = cooldown;

        // Offsets für x & y, wenn gezeichnet
        const allOffsets = {
            bat: {
                0: { x: 2,        y: 0 }, // up
                1: { x: 2,      y: 0 },   // left
                2: { x: -2,        y: 0 }, // down
                3: { x: -2,       y: 0 }    // right
            },
            gun: {
                0: { x: 2,        y: -7 }, // up
                1: { x: -4,      y: 4 },   // left
                2: { x: -2,        y: 7 }, // down
                3: { x: 4,       y: 4 }    // right
            },
            shotgun: {
                0: { x: 2,        y: -7 }, // up
                1: { x: -4,      y: 4 },   // left
                2: { x: -2,        y: 7 }, // down
                3: { x: 4,       y: 4 }    // right
            },
        };

        this.displayOffset = allOffsets[name] ?? allOffsets.bat;
    }
}