// Enemy.js

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, hp, speed) {
        super(scene, x, y, texture);

        this.animPrefix = 'zBig';

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);

        // Individuelle Werte, die von außen übergeben werden
        this.hp = hp;
        this.maxHp = hp;
        this.speed = speed;
        this.chaseDist = 100;
        this.weight = 100;

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

    // Gemeinsame KI-Logik für das Verfolgen
    chasePlayer(player, chaseDist) {
        if (this.isKnockedBack) {
            this.handleAnimation(this.body.velocity);
            return;  // Velocity nicht anfassen, Knockback wirken lassen
        }

        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        if (dist < chaseDist) {
            let dirX = player.x - this.x;
            let dirY = player.y - this.y;
            let vector = new Phaser.Math.Vector2(dirX, dirY).normalize();

            this.body.setVelocity(vector.x * this.speed, vector.y * this.speed);

        } else {
            this.body.setVelocity(0);
        }
        this.handleAnimation(this.body.velocity);
    }

    // Standard-Animation (kann von Unterklassen überschrieben werden)
    handleAnimation(vector) {
        /*if (vector.x > 0) this.anims.play('zBigRight', true);
        else if (vector.x < 0) this.anims.play('zBigLeft', true);*/

        if (Math.abs(vector.x) < 1 && Math.abs(vector.y) < 1) {
            this.setFrame(0);
            this.anims.stop();
            return;
        }

        let dir;
        if (Math.abs(vector.x) > Math.abs(vector.y)) {
            dir = vector.x > 0 ? 'Right' : 'Left';
        } else {
            dir = vector.y > 0 ? 'Down' : 'Up';
        }
        this.anims.play(this.animPrefix + dir, true);
    }

    applyKnockback(sourceX, sourceY, weight = 75, duration = 200) {
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
        if (bullet && this.scene.bullets.contains(bullet)) {
            bullet.destroy(); // Kugel zerstören
        } else {
            this.applyKnockback(this.scene.player.x, this.scene.player.y, this.weight);
        }

        this.showDamageNumber(amount);
        this.hp -= amount;

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

            this.destroy();
        }
    }

    doDamage(player) {
        player.addHealth(-0.3); // Direkt die Methode des Spielers aufrufen
    }

    // Wir übergeben einfach das Grafik-Objekt der Szene
    drawHealthBar(graphics) {
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