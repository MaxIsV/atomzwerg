import Player from "../entities/Player.js";
import FastZombie from "../entities/FastZombie.js";
import Item from "../entities/Item.js";
import GroundItem from "../entities/GroundItem.js";

export default class BaseLevelScene extends Phaser.Scene {
    constructor(key) {
        super({ key: key });
    }

    // Gemeinsame create-Logik für ALLE Levels
    setupLevel(map, startX, startY) {

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
        //this.player = new Player(this, startX, startY);

        this.scene.launch('UIScene', { player: this.player });
        this.scene.bringToTop('UIScene');

        //this.physics.add.collider(this.player, this.obstaclesLayer);
        this.physics.add.collider(this.player, this.chests);

        // Kamera & Welt-Grenzen
        this.physics.world.setBounds(0, 0, 2000, 2000);
        this.cameras.main.setBounds(0, 0, 2000, 2000);
        this.cameras.main.startFollow(this.player, true, 1, 1);
        this.cameras.main.setRoundPixels(true);

        // Animationen erstellen
        this.createAnimations();

        // UI & HUD
        this.createDeathText();

        // Projektile
        this.bullets = this.physics.add.group();
        this.physics.add.collider(this.bullets, this.obstaclesLayer, this.destroyBullet, null, this);

        // Zombies erstellen
        this.zombies = this.physics.add.group();

        const zombieObjects = map.filterObjects('Interactions', obj => obj.name === 'zombie');

        zombieObjects.forEach(zombieData => {
            let zombie = new FastZombie(this, zombieData.x, zombieData.y);

            this.zombies.add(zombie);
        });

        this.zombieHealthGraphics = this.add.graphics();
        this.zombieHealthGraphics.setDepth(10);

        // Zombie Collider
        //this.physics.add.collider(this.zombies, this.obstaclesLayer);
        this.physics.add.collider(this.zombies, this.zombies);


        this.physics.add.collider(this.player, this.zombies, (player, zombie) => {
            zombie.doDamage(player);
        }, null, this);

        this.physics.add.overlap(this.bullets, this.zombies, (bullet, zombie) => {
            zombie.takeDamage(34, bullet);
        }, null, this);

        // Create objects for collisions
        // Sicherheitscheck: Falls du das Layer in Tiled mal vergisst zu zeichnen
        if (this.collisionLayer && this.collisionLayer.objects) {

            // 3. Jedes einzelne gezeichnete Rechteck durchlaufen
            this.collisionLayer.objects.forEach(obj => {

                // Tiled platziert den Ursprung (Origin) bei Objekten manchmal anders.
                // Phaser braucht für statische Körper die Mitte, deshalb rechnen wir + width/2
                const x = obj.x + (obj.width / 2);
                const y = obj.y + (obj.height / 2);

                // Erstelle einen unsichtbaren, statischen Physik-Körper
                let wall = this.physics.add.staticSprite(x, y, null);

                // Setze die exakte Größe des Tiled-Rechtecks auf den Physik-Körper
                wall.body.setSize(obj.width, obj.height);

                // Macht das Hilfs-Sprite unsichtbar (wir wollen ja nur die unsichtbare Wand)
                wall.setVisible(false);

                // Füge die Wand unserer Gruppe hinzu
                this.collisionGroup.add(wall);
            });
        }

        // 4. Jetzt verknüpfst du die Gruppe ganz normal per Collider mit deinem Spieler!
        this.physics.add.collider(this.player, this.collisionGroup);

        // Falls auch deine Zombies und Kugeln an den Wänden hängen bleiben sollen:
        this.physics.add.collider(this.zombies, this.collisionGroup);
        this.physics.add.collider(this.bullets, this.collisionGroup, (bullet) => {
            bullet.destroy(); // Zerstört die Kugel bei Wandtreffer
        });

        // Post Update für die Waffe
        this.events.on('postupdate', () => {
            this.player.updateItemPosition();
        });
    }

    createDeathText() {
        this.gameOverText = this.add.text(160, 120, 'GAME OVER\nPress E to Restart', { fontSize: '24px', fill: '#ff0000', fontFamily: 'CustomFont', align: 'center', fontStyle: 'bold' });
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.setScrollFactor(0);
        this.gameOverText.setDepth(100);
        this.gameOverText.setVisible(false);

    }

    createAnimations() {
        this.anims.create({ key: 'left', frames: this.anims.generateFrameNumbers('main_left', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'right', frames: this.anims.generateFrameNumbers('main_right', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'down', frames: this.anims.generateFrameNumbers('main_down', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'up', frames: this.anims.generateFrameNumbers('main_up', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'zLeft', frames: this.anims.generateFrameNumbers('zombie_left', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'zRight', frames: this.anims.generateFrameNumbers('zombie_right', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
    }

    updateZombies() {
        this.zombies.children.iterate((zombie) => {
            if (!zombie || !zombie.active) return;

            zombie.chasePlayer(this.player, 200);
        });
    }

    drawZombiesHealthBars() {
        this.zombieHealthGraphics.clear();
        this.zombies.children.iterate((zombie) => {
            if (zombie && zombie.active) {
                zombie.drawHealthBar(this.zombieHealthGraphics);
            }
        });
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

    spawnItem(x, y, isLoot) {
        // If method is called to spawn new item as a loot
        if (isLoot) {
            const shotgunData = new Item('Shotgun', 'shotgun', 34, 80);

            let groundShotgun = new GroundItem(this, x, y, shotgunData);

            this.items.add(groundShotgun);

        // If method is called to leave currentItem on the ground
        } else {
            const itemToDrop = this.player.ownedItems[this.player.activeItemIndex];

            let newGroundItem = new GroundItem(this, x, y, itemToDrop);

            this.items.add(newGroundItem);
        }
    }

    pickupItem(groundItem) {
        let pl = this.player;

        if (pl.ownedItems[pl.activeItemIndex] != null) {
            this.spawnItem(pl.x, pl.y, false);
        }

        // Put new item to the player inventory
        pl.ownedItems[pl.activeItemIndex] = groundItem.itemData;

        // Update heldItem texture
        pl.heldItem.setTexture(pl.ownedItems[pl.activeItemIndex].textureKey);
        pl.heldItem.setVisible(true);

        groundItem.destroy();
    }
}