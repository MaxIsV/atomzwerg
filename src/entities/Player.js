// Player.js
import Item from "./Item.js";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'main_down');


        // Spieler zur Szene und Physik hinzufügen
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);

        // Stats
        this.health = 100;
        this.healthMax = 100;
        this.radiation = 0;
        this.radiationMax = 100;
        this.radFactor = -0.001;
        this.speed = 120;

        this.isDead = false;

        // Richtungen
        this.direction = 3; // Player facing direction: 0 = North, 1 = West, 2 = South, 3 = East
        this.directions = {
            0: 'up',
            1: 'left',
            2: 'down',
            3: 'right'
        }

        // Inventar & Waffen
        //this.ownedItems = [new Item('bat', 'bat', 34, 200), new Item('gun', 'gun', 34, 150)];
        this.ownedItems = [new Item('gun', 'gun', 34, 75), new Item('bat', 'bat', 34, 200)];

        this.activeItemIndex = 0;
        this.lastFired = 0;

        // Waffe in der Hand

        this.heldItem = scene.add.sprite(x, y, this.ownedItems[this.activeItemIndex].textureKey);
        this.heldItem.setOrigin(0.5, 0.5);

        // Inputs (Tasten)
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.key1 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.key2 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.interactKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // UI instance
        this.uiScene = this.scene.scene.get('UIScene');
    }

    addHealth(amount) {
        this.health += amount;
        this.showDamageNumber(amount);

        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }

        if (this.health >= this.healthMax) {
            this.health = this.healthMax
        }
    }

    decreaseRad(amount) {
        this.radiation -= amount;
        if (this.radiation < 0) this.radiation = 0;
        if (this.radiation >= 100) {
            this.radiation = 100;
            this.die();
        }
    }

    die() {
        this.isDead = true;
        this.setVelocity(0);
        this.setTint(0xff0000);
        this.anims.stop();
        this.scene.handlePlayerDeath(); // Ruft Game Over Text in der Szene auf
    }

    playAttackAnimation() {
        const item = this.ownedItems[this.activeItemIndex];
        const dir = this.directions[this.direction];

        if (item && item.name === 'bat') {
            console.log('attackAnimation läuft');
            this.heldItem.anims.play(item.name + '_' + dir + '_att', true);

            this.heldItem.once('animationcomplete', () => {
                this.isAttacking = false;
            });
        }
    }

    updateItemPosition() {
        if (this.isDead) return;

        const item = this.ownedItems[this.activeItemIndex];
        const dir = this.directions[this.direction];

        if (item && !this.isAttacking) {
            this.heldItem.anims.play(item.name + '_' + dir + '_' + 'idle', true);

            const off = item.displayOffset[this.direction];
            this.heldItem.x = this.x + off.x;
            this.heldItem.y = this.y + off.y;

            if (dir === 'up') {
                this.heldItem.setDepth(-3);
            } else this.heldItem.setDepth(-1);

        }  else if (!this.isAttacking) {
            this.heldItem.anims.play('hands_' + dir, true);

            this.heldItem.x = this.x;
            this.heldItem.y = this.y;

            this.heldItem.setDepth(-1);
        }
    }

    update() {
        if (this.isDead) return;

        // Strahlung steigt pro Frame
        this.decreaseRad(this.radFactor);

        // Waffenwechsel
        this.checkWeaponSelected();

        // Bewegung zurücksetzen
        this.setVelocity(0);
        let moveX = 0;
        let moveY = 0;

        // Input Check
        if (this.cursors.left.isDown)   { moveX = -1; this.direction = 1; }
        if (this.cursors.right.isDown)  { moveX = 1; this.direction = 3;  }
        if (this.cursors.up.isDown)     { moveY = -1; this.direction = 0; }
        if (this.cursors.down.isDown)   { moveY = 1; this.direction = 2;  }

        // Vektor normalisieren (damit diagonal nicht schneller ist)
        let vector = new Phaser.Math.Vector2(moveX, moveY).normalize();
        this.setVelocityX(vector.x * this.speed);
        this.setVelocityY(vector.y * this.speed);

        // Apply animation only ONCE - but only if not attacking
        if (!this.isAttacking) {
            if (moveX === 0 && moveY === 0) {
                //this.anims.stop();
                //this.setFrame(0);
                this.anims.play('idle_' + this.directions[this.direction], true);
            } else if (Math.abs(moveX) >= Math.abs(moveY)) {
                this.anims.play(moveX > 0 ? 'right' : 'left', true);
            } else {
                this.anims.play(moveY > 0 ? 'down' : 'up', true);
            }
        }


        // Attack: Fire or Punch
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {

            const item = this.ownedItems[this.activeItemIndex];

            // Only attack melee if it's a bat
            if (item && item.name === 'bat') {
                this.meleeAttack();

                // Only fire bullets if holding a weapon && colldown away
            } else if (item && this.scene.time.now > this.lastFired) {
                const currentWeapon = item;

                this.fireBullet(currentWeapon.damage);

                this.lastFired = this.scene.time.now + currentWeapon.cooldown;
            }
        }

        // Draw UI Weapons
        this.uiScene.drawWeapons();
    }

    checkWeaponSelected() {
        if (Phaser.Input.Keyboard.JustDown(this.key1)) {
            this.activeItemIndex = 0;

            this.uiScene.selectSlot(0);

        } else if (Phaser.Input.Keyboard.JustDown(this.key2)) {
            this.activeItemIndex = 1;

            this.uiScene.selectSlot(1);
        }
    }

    meleeAttack() {
        // Cooldown: nicht spammen
        if (this.attackCooldown) return;

        this.attackCooldown = true;

        this.isAttacking = true;
        this.playAttackAnimation();

        this.scene.time.delayedCall(400, () => {
            this.attackCooldown = false
            this.isAttacking = false; // Fallback, falls animationcomplete nie kam
        });

        // Offset je nach Blickrichtung
        const offsets = {
            3: { x: 14, y: 0 },     // right
            1:  { x: -14, y: 0 },   // left
            0:    { x: 0, y: -14 }, // up
            2:  { x: 0, y: 14 }     // down
        };
        const off = offsets[this.direction] || offsets.right;

        // Unsichtbare Hitbox-Zone vor dem Spieler
        const hitbox = this.scene.add.zone(this.x + off.x, this.y + off.y, 16, 16);
        this.scene.physics.add.existing(hitbox);
        hitbox.body.setAllowGravity(false);

        // Treffer prüfen
        const alreadyHit = new Set();
        this.scene.physics.add.overlap(hitbox, this.scene.zombies, (hb, zombie) => {

            if (alreadyHit.has(zombie)) return;
            alreadyHit.add(zombie);

            // Wenn .damage vorhanden - nimm es, wenn nicht - FaustDamage = 20
            zombie.takeDamage(this.ownedItems[this.activeItemIndex]?.damage ?? 20, this);
        });

        // Hitbox nach kurzer Zeit wieder entfernen
        this.scene.time.delayedCall(100, () => hitbox.destroy());
    }

    fireBullet(damage) {
        // Erzeugt ein Projektil aus der Bullet-Group der MainScene
        let bullet = this.scene.bullets.create(this.heldItem.x, this.heldItem.y, 'bullet');

        let fire = this.scene.add.sprite()

        if (bullet) {
            let bulletSpeed = 400;

            if (this.direction === 3) {
                bullet.body.setVelocityX(bulletSpeed);
            } else if (this.direction === 2) {
                bullet.body.setVelocityY(bulletSpeed);
            } else if (this.direction === 1) {
                bullet.body.setVelocityX(-bulletSpeed);
            } else if (this.direction === 0) {
                bullet.body.setVelocityY(-bulletSpeed);
            }

            this.scene.time.delayedCall(1500, () => {
                if (bullet && bullet.active) {
                    bullet.destroy();
                }
            });
        }
    }

    showDamageNumber(amount) {
        if (amount <= 0) return;

        const text = this.scene.add.text(Phaser.Math.Between(-6, 6) + this.x, this.y - 10, amount, {
            fontSize: '8px',
            fontFamily: 'CustomFont',
            color: '#4cd324',
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