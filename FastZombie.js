// FastZombie.js
import Enemy from './Enemy.js';

export default class FastZombie extends Enemy {
    constructor(scene, x, y) {
        // Ruft Enemy auf mit: texture='zombie_fast', HP=50, Speed=150
        super(scene, x, y, 'zombie_fast', 50, 150);
    }

    // Hier könntest du eine aggressivere KI einbauen (z.B. Springen)
}