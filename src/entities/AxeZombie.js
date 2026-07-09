// AxeZombie.js
import Enemy from './Enemy.js';

export default class AxeZombie extends Enemy {
    constructor(scene, x, y) {
        // Ruft Enemy auf mit: texture='zombie_fast', HP=50, Speed=150
        super(scene, x, y, 'zombie_axe_right', 175, 35);

        this.animPrefix = 'zAxe';
        this.hitFrameIndex = 5; // Hit-Frame index 1-basiert

        this.chaseDist = 150;
        this.weight = 75;
        this.attackDist = 15;
        this.damage = 20;

        // Chance to drop a specific loot from the mob
        this.lootChances = {
            iod: 40,
            medkit: 10,
            bat: 25,
            gun: 15,
            shotgun: 10
        };
    }

    // Hier könntest du eine aggressivere KI einbauen (z.B. Springen)
}