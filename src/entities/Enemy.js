// Enemy.js

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, hp, speed) {
        super(scene, x, y, texture);

        this.animPrefix = 'zBig'; // Von unterklassen überschrieben
        this.hitFrameIndex = 3; // Hit-Frame index 1-basiert
        this.lastDir = 'left';

        this.isDead = false;


        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        this.setDepth(-2);

        // Individuelle Werte, die von außen übergeben werden
        this.hp = hp;
        this.maxHp = hp;
        this.speed = speed;
        this.chaseDist = 150;
        this.weight = 100;
        this.attackDist = 10;
        this.damage = 20;

        // To define if enemy is currently attacking
        this.isAttacking = false;

        // Chance to drop a specific loot from the mob
        this.lootChances = {
            iod: 60,
            medkit: 10,
            bat: 15,
            gun: 10,
            shotgun: 5
        };


    }

    rollLoot() {
        const roll = Phaser.Math.Between(1, 100);
        let cumulative = 0;

        for (const [key, chance] of Object.entries(this.lootChances)) {
            cumulative += chance;
            if (roll <= cumulative) {
                return key; // z.B. 'iod', 'bat', ...
            }
        }

        return null;
    }

    attackPlayer(player) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        if (dist <= this.attackDist) {
            this.doDamage(player);
        }
    }

    // Gemeinsame KI-Logik für das Verfolgen
    chasePlayer(player, chaseDist) {
        if (this.isKnockedBack || this.isDead) {
            this.handleAnimation(this.body.velocity);
            return;  // Velocity nicht anfassen, Knockback wirken lassen
        }

        this.body.setVelocity(0);

        if(this.isAttacking) return; // laufender Angriff aus früherem Frame

        this.attackPlayer(player);
        if (this.isAttacking) return;   // ← NEU: Angriff wurde GERADE gestartet

        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        if (dist < chaseDist && dist > this.attackDist) {
            let dirX = player.x - this.x;
            let dirY = player.y - this.y;
            let vector = new Phaser.Math.Vector2(dirX, dirY).normalize();

            this.body.setVelocity(vector.x * this.speed, vector.y * this.speed);

            this.lastDir = this.getDir(vector);
        }
        this.handleAnimation(this.body.velocity);
    }

    // Standard-Animation (kann von Unterklassen überschrieben werden)
    handleAnimation(vector) {
        if (this.isAttacking || this.isDead) return;   // Attack-Animation nicht anfassen

        if (Math.abs(vector.x) < 1 && Math.abs(vector.y) < 1) {
            this.anims.play(this.animPrefix + '_idle_' + this.lastDir, true);

        } else {
            this.anims.play(this.animPrefix + '_' + this.getDir(vector), true);
        }
    }

    // Extract a one of 4 possible directions out of given Vector
    getDir(vector) {
        if (Math.abs(vector.x) > Math.abs(vector.y)) {
            return vector.x > 0 ? 'right' : 'left';
        } else {
            return vector.y > 0 ? 'down' : 'up';
        }
    }

    applyKnockback(sourceX, sourceY, weight = 75, duration = 200) {
        if (this.isDead) {
            this.setVelocity(0);
            return;
        }

        const angle = Phaser.Math.Angle.Between(sourceX, sourceY, this.x, this.y);

        const force = 130 - weight;
        this.body.setVelocity(Math.cos(angle) * force, Math.sin(angle) * force);

        this.isKnockedBack = true;

        // Weiß aufblitzen
        this.setTintFill(0xffffff);

        this.scene.time.delayedCall(duration, () => {
            this.isKnockedBack = false;
            this.clearTint();
        });
    }

    takeDamage(amount, bullet) {
        if(this.isDead) return;

        if (bullet && this.scene.bullets.contains(bullet)) {
            bullet.destroy(); // Kugel zerstören
        } else {
            this.applyKnockback(this.scene.player.x, this.scene.player.y, this.weight);
        }

        this.showDamageNumber(amount);
        this.hp -= amount;
        //this.scene.sound.play('zombie_damage');

        if (this.hp <= 0) {
            // Über 'this.scene' kann der Zombie auf Methoden der MainScene zugreifen!
            /*this.scene.spawnItem(this.x, this.y, true);

            this.scene.dropIod(this.x, this.y);*/

            const lootActions = {
                iod:     () => this.scene.dropIod(this.x, this.y),
                medkit:  () => this.scene.dropMedkit(this.x, this.y),
                bat:     () => this.scene.spawnItem(this.x, this.y, true, 'bat'),
                gun:     () => this.scene.spawnItem(this.x, this.y, true, 'gun'),
                shotgun: () => this.scene.spawnItem(this.x, this.y, true, 'shotgun')
            };

            const result = this.rollLoot();
            if (result) lootActions[result]();

            this.lastDir = this.lastDir === 'left' ? 'left' : 'right';

            this.anims.play(this.animPrefix + '_death_' + this.lastDir, true);
            this.scene.sound.play(this.animPrefix + '_death');

            this.body.enable = false;
            this.isDead = true;
            //this.body.
            this.setVelocity(0);

            this.scene.time.delayedCall(3000, () => {
                this.destroy();
            });
        }
    }

    doDamage(player) {
        if (this.isAttacking) return;
        this.isAttacking = true;

        let dir = this.getDir(new Phaser.Math.Vector2(player.x - this.x, player.y - this.y));
        const animKey = this.animPrefix + '_att_' + dir;

        this.anims.play(animKey);
        this.scene.sound.play('zombie_attack', { volume: 0.3 });

        // Bei jedem Frame-Wechsel prüfen, ob wir beim Hit-Frame sind
        const onFrame = (anim, frame) => {
            // frame.index ist 1-basiert (erstes Frame = 1, nicht 0). Anders als im Spritesheet!
            if (anim.key === animKey && frame.index === this.hitFrameIndex) { // Hit-Frame
                const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

                // Die Distanz neu auswerten, falls Spieler weggerannt ist
                if (dist < this.attackDist) {

                    player.addHealth(-this.damage);
                    player.applyKnockback(this.x, this.y, this.weight * 2);
                }
                this.off('animationupdate', onFrame);
            }
        };
        this.on('animationupdate', onFrame);

        this.once('animationcomplete-' + this.animPrefix + '_att_' + dir, () => {
           this.isAttacking = false;
            this.off('animationupdate', onFrame); // aufräumen, falls Hit-Frame nie erreicht
        });

        // Fallback-Timer im Zombie, wie beim Player – falls die Animation doch mal unterbrochen wird
        this.scene.time.delayedCall(2000, () => {
            this.isAttacking = false;
            this.off('animationupdate', onFrame); // aufräumen, falls Hit-Frame nie erreicht
        });
    }

    // Wir übergeben einfach das Grafik-Objekt der Szene
    drawHealthBar(graphics) {
        if (this.isDead) return;

        const barWidth = 20;
        const barHeight = 3;
        const barX = this.x - (barWidth / 2);
        const barY = this.y - (this.displayHeight / 2) - 6;

        // Hintergrund (Schwarz)
        graphics.fillStyle(0x000000, 0.6);
        graphics.fillRect(barX, barY, barWidth, barHeight);

        // Roter Lebensbalken
        const hpPercentage = this.hp / this.maxHp;
        if (hpPercentage > 0) {
            graphics.fillStyle(0xff0000, 1);
            graphics.fillRect(barX, barY, barWidth * hpPercentage, barHeight);
        }
    }

    showDamageNumber(amount) {
        const text = this.scene.add.text(Phaser.Math.Between(-6, 6) + this.x, this.y - 10, amount, {
            fontSize: '8px',
            fontFamily: 'CustomFont',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 1
        });
        text.setOrigin(0.5);
        text.setDepth(20); // über Zombies und Healthbars

        this.scene.tweens.add({
            targets: text,
            y: text.y - 15,        // nach oben schweben
            alpha: 0,              // dabei ausblenden
            duration: 600,
            ease: 'Cubic.easeOut',
            onComplete: () => text.destroy()
        });
    }


}