// BigZombie.js
import Enemy from './Enemy.js';

export default class BigZombie extends Enemy {
    constructor(scene, x, y) {
        // Ruft Enemy auf mit: texture='zombie_fast', HP=50, Speed=150
        super(scene, x, y, 'zombie_big_right', 250, 25);

        this.animPrefix = 'zBig';
        this.hitFrameIndex = 4; // Hit-Frame index 1-basiert

        this.chaseDist = 200;
        this.weight = 100;
        this.attackDist = 20;
        this.damage = 30;

        // Chance to drop a specific loot from the mob
        this.lootChances = {
            iod: 50,
            medkit: 10,
            bat: 25,
            gun: 10,
            shotgun: 5
        };
    }

    // Hier könntest du eine aggressivere KI einbauen (z.B. Springen)
}