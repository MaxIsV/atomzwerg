// MainScene.js
import Player from './Player.js';
import FastZombie from "./FastZombie.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        // HIER KOMMT DEIN GANZER PRELOAD-BLOCK REIN:
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');

        this.load.image('gun', 'assets/items/Gun.png');
        this.load.image('shotgun', 'assets/items/Shotgun.png');
        this.load.image('bat', 'assets/items/Bat.png');
        this.load.image('bullet', 'assets/items/Bullet.png');

        this.load.spritesheet('main_right', 'assets/character/run/Character_side_run-Sheet6.png', { frameWidth: 14, frameHeight: 17 });
        this.load.spritesheet('main_left', 'assets/character/run/Character_side-left_run-Sheet6.png', { frameWidth: 14, frameHeight: 17 });
        this.load.spritesheet('main_up', 'assets/character/run/Character_up_run-Sheet6.png', { frameWidth: 13, frameHeight: 17 });
        this.load.spritesheet('main_down', 'assets/character/run/Character_down_run-Sheet6.png', { frameWidth: 13, frameHeight: 17 });

        this.load.spritesheet('zombie_right', 'assets/zombieBig/Zombie_Big_Side_Walk-Sheet8.png', { frameWidth: 16, frameHeight: 24 });
        this.load.spritesheet('zombie_left', 'assets/zombieBig/Zombie_Big_Side-left_Walk-Sheet8.png', { frameWidth: 16, frameHeight: 24 });

        this.load.image('first', 'assets/first.png');
        this.load.image('second', 'assets/second.png');
        this.load.image('third', 'assets/third.png');
        this.load.image('fourth', 'assets/fourth.png');

        this.load.tilemapTiledJSON('map', 'assets/testzwerg.tmj');
    }

    create() {
        const grid = this.add.grid(1000, 1000, 2000, 2000, 64, 64, 0x222222).setOutlineStyle(0x444444);

        // Map aufbauen
        const map = this.make.tilemap({ key: 'map' });
        const fTileset = map.addTilesetImage('first', 'first');
        const sTileset = map.addTilesetImage('second', 'second');
        const tTileset = map.addTilesetImage('third', 'third');
        const gTileset = map.addTilesetImage('fourth', 'fourth');
        const allTilesets = [fTileset, sTileset, tTileset, gTileset];

        const backgroundLayer = map.createLayer('Background', allTilesets, 0, 0);
        this.obstaclesLayer = map.createLayer('Obstacles', allTilesets, 0, 0);
        this.obstaclesLayer.setCollisionByExclusion([-1]);

        // Kisten (Chests)
        this.chests = this.physics.add.group();
        const chestObjects = map.createFromObjects('Interactions', { name: 'chest', key: 'star' });
        this.chests.addMultiple(chestObjects);
        this.chests.children.iterate((chest) => {
            chest.body.setImmovable(true);
            chest.setData('opened', false);
            chest.alpha = 0;
        });

        // Items (Loot auf dem Boden)
        this.items = this.physics.add.staticGroup();

        // SPIELER INSTANZIIEREN (Ersetzt die langen Physik-Blöcke)
        this.player = new Player(this, 100, 300);

        this.physics.add.collider(this.player, this.obstaclesLayer);
        this.physics.add.collider(this.player, this.chests);

        // Kamera & Welt-Grenzen
        this.physics.world.setBounds(0, 0, 2000, 2000);
        this.cameras.main.setBounds(0, 0, 2000, 2000);
        this.cameras.main.startFollow(this.player, true, 1, 1);
        this.cameras.main.setRoundPixels(true);

        // Animationen erstellen
        this.createAnimations();

        // UI & HUD
        this.createUI();

        // Projektile
        this.bullets = this.physics.add.group();
        this.physics.add.collider(this.bullets, this.obstaclesLayer, this.destroyBullet, null, this);

        // Zombies erstellen
        this.zombies = this.physics.add.group();

        /*const zombieObjects = map.createFromObjects('Interactions', { name: 'zombie', key: 'zombie_left' });
        this.zombies.addMultiple(zombieObjects);
        this.zombies.children.iterate((zombie) => {
            if (zombie.body) {
                zombie.body.setCollideWorldBounds(true);
                zombie.setData('hp', 100);
                zombie.setData('maxHp', 100);
            }
        });*/

        const zombieObjects = map.filterObjects('Interactions', obj => obj.name === 'zombie');

        zombieObjects.forEach(zombieData => {
            let zombie = new FastZombie(this, zombieData.x, zombieData.y);

            this.zombies.add(zombie);
        });

        this.zombieHealthGraphics = this.add.graphics();
        this.zombieHealthGraphics.setDepth(10);

        // Zombie Collider
        this.physics.add.collider(this.zombies, this.obstaclesLayer);
        this.physics.add.collider(this.zombies, this.zombies);

        /*this.physics.add.collider(this.player, this.zombies, this.handleZombieDamage, null, this);
        this.physics.add.overlap(this.bullets, this.zombies, this.damageZombie, null, this);*/

        this.physics.add.collider(this.player, this.zombies, (player, zombie) => {
            zombie.doDamage(player);
        }, null, this);

        this.physics.add.overlap(this.bullets, this.zombies, (bullet, zombie) => {
            zombie.takeDamage(34, bullet);
        }, null, this);

        // Post Update für die Waffe
        this.events.on('postupdate', () => {
            this.player.updateItemPosition();
        });
    }

    createAnimations() {
        this.anims.create({ key: 'left', frames: this.anims.generateFrameNumbers('main_left', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'right', frames: this.anims.generateFrameNumbers('main_right', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'down', frames: this.anims.generateFrameNumbers('main_down', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'up', frames: this.anims.generateFrameNumbers('main_up', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'zLeft', frames: this.anims.generateFrameNumbers('zombie_left', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'zRight', frames: this.anims.generateFrameNumbers('zombie_right', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
    }

    createUI() {
        this.healthBar = this.add.graphics().setScrollFactor(0);
        this.healthCounter = this.add.text(18, 11, 'Health: 100', { fontSize: '8px', fill: '#000000', fontFamily: 'CustomFont' }).setScrollFactor(0);

        this.radiationBar = this.add.graphics().setScrollFactor(0);
        this.radiationCounter = this.add.text(18, 26, 'Radiation: 0', { fontSize: '8px', fill: '#000000', fontFamily: 'CustomFont' }).setScrollFactor(0);

        this.gameOverText = this.add.text(160, 120, 'GAME OVER\nPress E to Restart', { fontSize: '24px', fill: '#ff0000', fontFamily: 'CustomFont', align: 'center', fontStyle: 'bold' });
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.setScrollFactor(0);
        this.gameOverText.setDepth(100);
        this.gameOverText.setVisible(false);

        this.drawHealthBar();
        this.drawRadiationBar();
    }

    update() {
        // Spiel-Neustart bei Tod
        if (this.player.isDead) {
            if (Phaser.Input.Keyboard.JustDown(this.player.interactKey)) {
                this.scene.restart();
            }
            return;
        }

        // Ruft die Update-Funktion des Spielers auf
        this.player.update();

        // Updates für UI und Gegner
        this.updateCounters();
        this.updateZombies();
        this.drawZombiesHealthBars();

        // Interaktionen
        if (Phaser.Input.Keyboard.JustDown(this.player.interactKey)) {
            this.checkChestInteraction();
            this.checkLootInteraction();
        }
    }

    // ----- GAMEPLAY FUNKTIONEN -----

    updateCounters() {
        this.healthCounter.setText('Health: ' + this.player.health.toFixed(2));
        this.radiationCounter.setText('Radiation: ' + this.player.radiation.toFixed(2));
    }

    drawHealthBar() {
        this.healthBar.clear();
        this.healthBar.fillStyle(0x000000, 0.5);
        this.healthBar.fillRect(10, 10, 100, 10);
        const percentage = this.player.health / this.player.healthMax;
        if (percentage > 0) {
            this.healthBar.fillStyle(0xF23813, 1);
            this.healthBar.fillRect(10, 10, 100 * percentage, 10);
        }
    }

    drawRadiationBar() {
        this.radiationBar.clear();
        this.radiationBar.fillStyle(0x000000, 0.5);
        this.radiationBar.fillRect(10, 25, 100, 10);
        const percentage = this.player.radiation / this.player.radiationMax;
        if (percentage > 0) {
            this.radiationBar.fillStyle(0x13F274, 1);
            this.radiationBar.fillRect(10, 25, 100 * percentage, 10);
        }
    }

    handlePlayerDeath() {
        this.zombies.children.iterate((zombie) => {
            if (zombie && zombie.body) zombie.body.setVelocity(0);
        });
        this.gameOverText.setVisible(true);
        this.time.delayedCall(3600, () => {
            this.scene.restart();
        });
    }

    updateZombies() {
        /*const chaseDist = 300;
        const ZOMBIE_SPEED = 80;

        this.zombies.children.iterate((zombie) => {
            if (!zombie || !zombie.active) return;
            const dist = Phaser.Math.Distance.Between(zombie.x, zombie.y, this.player.x, this.player.y);

            if (dist < chaseDist) {
                let dirX = this.player.x - zombie.x;
                let dirY = this.player.y - zombie.y;
                let vector = new Phaser.Math.Vector2(dirX, dirY).normalize();

                zombie.body.setVelocity(vector.x * ZOMBIE_SPEED, vector.y * ZOMBIE_SPEED);
                zombie.flipX = false;
                if (vector.x > 0) zombie.anims.play('zRight', true);
                else if (vector.x < 0) zombie.anims.play('zLeft', true);
            } else {
                zombie.body.setVelocity(0);
            }
        });*/

        this.zombies.children.iterate((zombie) => {
            if (!zombie || !zombie.active) return;

            zombie.chasePlayer(this.player, 200);
        });
    }

    drawZombiesHealthBars() {
        /*this.zombieHealthGraphics.clear();
        this.zombies.children.iterate((zombie) => {
            if (!zombie || !zombie.active) return;
            const maxHp = zombie.getData('maxHp');
            const currentHp = zombie.getData('hp');
            const barWidth = 20;
            const barHeight = 3;
            const barX = zombie.x - (barWidth / 2);
            const barY = zombie.y - (zombie.displayHeight / 2) - 6;

            this.zombieHealthGraphics.fillStyle(0x000000, 0.6);
            this.zombieHealthGraphics.fillRect(barX, barY, barWidth, barHeight);

            const hpPercentage = currentHp / maxHp;
            if (hpPercentage > 0) {
                this.zombieHealthGraphics.fillStyle(0xff0000, 1);
                this.zombieHealthGraphics.fillRect(barX, barY, barWidth * hpPercentage, barHeight);
            }
        });*/

        this.zombieHealthGraphics.clear();
        this.zombies.children.iterate((zombie) => {
            if (zombie && zombie.active) {
                zombie.drawHealthBar(this.zombieHealthGraphics);
            }
        });
    }

    handleZombieDamage() {
        this.player.addHealth(-0.3);
    }

    damageZombie(bullet, zombie) {
        bullet.destroy();
        let zHealth = zombie.getData('hp') - 34;
        zombie.setData('hp', zHealth);

        if (zHealth <= 0) {
            zombie.destroy();
            this.spawnItem(zombie.x, zombie.y, true);
        }
    }

    destroyBullet(bullet) {
        bullet.destroy();
    }

    spawnItem(x, y, isLoot) {
        if (isLoot) {
            let drop = this.items.create(x, y, 'shotgun');
            if (drop) {
                drop.setScale(0.8);
                drop.setData('pickedUp', false);
                drop.setData('type', 'shotgun');
            }
        } else {
            let layingItem = this.items.create(x, y, this.player.ownedItemKeys[this.player.activeItemIndex]);
            layingItem.setData('pickedUp', false);
            layingItem.setData('type', this.player.ownedItemKeys[this.player.activeItemIndex]);
        }
    }

    checkLootInteraction() {
        const maxPickupDist = 35;
        this.items.children.iterate((item) => {
            if (!item || !item.active) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y);
            if (dist < maxPickupDist && !item.getData('pickedUp')) {
                this.pickupItem(item);
            }
        });
    }

    pickupItem(item) {
        item.setData('pickedUp', true);
        const itemType = item.getData('type');

        if (this.player.ownedItemKeys[this.player.activeItemIndex]) {
            this.spawnItem(item.x, item.y, false);
        }

        this.player.ownedItemKeys.splice(this.player.activeItemIndex, 1, itemType);
        this.player.heldItem.setTexture(itemType);
        item.destroy();
    }

    checkChestInteraction() {
        const maxDist = 80;
        this.chests.children.iterate((chest) => {
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, chest.x, chest.y);
            if (dist < maxDist && !chest.getData('opened')) {
                this.openChest(chest);
            }
        });
    }

    openChest(chest) {
        if (chest.getData('opened')) return;
        this.player.addHealth(-10);
        chest.setData('opened', true);
        chest.alpha = 1;
    }
}