// FastZombie.js
import Enemy from './Enemy.js';

export default class FastZombie extends Enemy {
    constructor(scene, x, y) {
        // Ruft Enemy auf mit: texture='zombie_fast', HP=50, Speed=150
        super(scene, x, y, 'zombie_small_right', 100, 50);

        this.animPrefix = 'zSmall';
        this.hitFrameIndex = 3; // Hit-Frame index 1-basiert

        this.chaseDist = 175;
        this.weight = 50;
        this.attackDist = 10;
        this.damage = 10;

        // Chance to drop a specific loot from the mob
        this.lootChances = {
            iod: 10,
            medkit: 10,
            bat: 20,
            gun: 57,
            shotgun: 3
        };
    }

    // Hier könntest du eine aggressivere KI einbauen (z.B. Springen)
}