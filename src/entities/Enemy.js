// Enemy.js
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, hp, speed) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);

        // Individuelle Werte, die von außen übergeben werden
        this.hp = hp;
        this.maxHp = hp;
        this.speed = speed;
    }

    // Gemeinsame KI-Logik für das Verfolgen
    chasePlayer(player, chaseDist) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        if (dist < chaseDist) {
            let dirX = player.x - this.x;
            let dirY = player.y - this.y;
            let vector = new Phaser.Math.Vector2(dirX, dirY).normalize();

            this.body.setVelocity(vector.x * this.speed, vector.y * this.speed);
            this.handleAnimation(vector);
        } else {
            this.body.setVelocity(0);
        }
    }

    handleAnimation(vector) {
        // Standard-Animation (kann von Unterklassen überschrieben werden)
        if (vector.x > 0) this.anims.play('zRight', true);
        else if (vector.x < 0) this.anims.play('zLeft', true);
    }

    takeDamage(amount, bullet) {
        if (bullet) bullet.destroy(); // Kugel zerstören

        this.hp -= amount;

        if (this.hp <= 0) {
            // Über 'this.scene' kann der Zombie auf Methoden der MainScene zugreifen!
            this.scene.spawnItem(this.x, this.y, true);
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


}