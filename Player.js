// Player.js
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
        this.radFactor = 0.001;
        this.speed = 200;
        this.isDead = false;

        // Richtungen
        this.facing = true; // true = rechts, false = links
        this.facingUp = false;

        // Inventar & Waffen
        this.ownedItemKeys = ['gun'];
        this.activeItemIndex = 0;
        this.lastFired = 0;

        // Waffe in der Hand
        this.heldItem = scene.add.sprite(x, y, this.ownedItemKeys[this.activeItemIndex]);
        this.heldItem.setOrigin(0.5, 0.5);

        // Inputs (Tasten)
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.key1 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.key2 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.interactKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    addHealth(amount) {
        this.health += amount;
        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
        this.scene.drawHealthBar(); // Sagt der MainScene, dass sie die UI updaten soll
    }

    addRad(amount) {
        this.radiation += amount;
        if (this.radiation < 0) this.radiation = 0;
        if (this.radiation > 100) this.radiation = 100;
        this.scene.drawRadiationBar();
    }

    die() {
        this.isDead = true;
        this.setVelocity(0);
        this.setTint(0xff0000);
        this.anims.stop();
        this.scene.handlePlayerDeath(); // Ruft Game Over Text in der Szene auf
    }

    updateItemPosition() {
        if (this.isDead) return;

        let offsetX = 11;
        let offsetY = 2;

        if (this.facing) {
            this.heldItem.x = this.x + offsetX;
            this.heldItem.flipX = false;
        } else {
            this.heldItem.x = this.x - offsetX;
            this.heldItem.flipX = true;
        }
        this.heldItem.y = this.y + offsetY;
        this.heldItem.setDepth(this.depth + 1);
    }

    update() {
        if (this.isDead) return;

        // Strahlung steigt pro Frame
        this.addRad(this.radFactor);

        // Waffenwechsel
        if (Phaser.Input.Keyboard.JustDown(this.key1) && this.ownedItemKeys[0]) {
            this.activeItemIndex = 0;
            this.heldItem.setTexture(this.ownedItemKeys[this.activeItemIndex]);
        }
        if (Phaser.Input.Keyboard.JustDown(this.key2) && this.ownedItemKeys[1]) {
            this.activeItemIndex = 1;
            this.heldItem.setTexture(this.ownedItemKeys[this.activeItemIndex]);
        }

        // Bewegung zurücksetzen
        this.setVelocity(0);
        let moveX = 0;
        let moveY = 0;

        // Input Check
        if (this.cursors.left.isDown) {
            moveX = -1;
            this.anims.play('left', true);
            this.facing = false;
        }
        if (this.cursors.right.isDown) {
            moveX = 1;
            this.anims.play('right', true);
            this.facing = true;
        }
        if (this.cursors.up.isDown) {
            moveY = -1;
            this.anims.play('up', true);
            this.facingUp = true;
        }
        if (this.cursors.down.isDown) {
            moveY = 1;
            this.anims.play('down', true);
            this.facingUp = false;
        }

        // Vektor normalisieren (damit diagonal nicht schneller ist)
        let vector = new Phaser.Math.Vector2(moveX, moveY).normalize();
        this.setVelocityX(vector.x * this.speed);
        this.setVelocityY(vector.y * this.speed);

        if (moveX === 0 && moveY === 0) {
            this.anims.stop();
            this.setFrame(0);
        }

        // Schießen
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.scene.time.now > this.lastFired) {
            const currentWeapon = this.ownedItemKeys[this.activeItemIndex];
            if (currentWeapon === 'gun') {
                this.fireBullet();
                this.lastFired = this.scene.time.now + 300;
            } else if (currentWeapon === 'shotgun') {
                this.fireBullet();
                this.lastFired = this.scene.time.now + 80;
            }
        }
    }

    fireBullet() {
        // Erzeugt ein Projektil aus der Bullet-Group der MainScene
        let bullet = this.scene.bullets.create(this.heldItem.x, this.heldItem.y, 'bullet');
        if (bullet) {
            let bulletSpeed = 400;
            if (this.facing) {
                bullet.body.setVelocityX(bulletSpeed);
            } else {
                bullet.body.setVelocityX(-bulletSpeed);
            }

            this.scene.time.delayedCall(1500, () => {
                if (bullet && bullet.active) {
                    bullet.destroy();
                }
            });
        }
    }
}