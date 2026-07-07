import Player from "../entities/Player.js";
import FastZombie from "../entities/FastZombie.js";
import Item from "../entities/Item.js";
import GroundItem from "../entities/GroundItem.js";
import BigZombie from "../entities/BigZombie.js";
import AxeZombie from "../entities/AxeZombie.js";

export default class BaseLevelScene extends Phaser.Scene {
    constructor(key) {
        super({ key: key });
    }

    init(data) {
        this.incomingPlayerdata = data.playerData ?? null;

        this.isTransitioning = false;   // frisch bei jedem Szenen-Start
    }

    loadDefault() {
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');

        this.load.image('gun', 'assets/items/Gun.png');
        this.load.image('shotgun', 'assets/items/Shotgun.png');
        this.load.image('bat', 'assets/items/Bat.png');
        this.load.image('bullet', 'assets/items/Bullet.png');
        this.load.image('medkit', 'assets/items/Bandage.png');
        this.load.image('iod', 'assets/items/Iod.png');

        this.load.spritesheet('main_right', 'assets/character/run/Character_side_run_no-hands-Sheet6.png', { frameWidth: 10, frameHeight: 17 });
        this.load.spritesheet('main_left', 'assets/character/run/Character_side-left_run_no-hands-Sheet6.png', { frameWidth: 10, frameHeight: 17 });
        this.load.spritesheet('main_down', 'assets/character/run/Character_down_run_no-hands-Sheet6.png', { frameWidth: 11, frameHeight: 17 });
        this.load.spritesheet('main_up', 'assets/character/run/Character_up_run_no-hands-Sheet6.png', { frameWidth: 11, frameHeight: 17 });

        this.load.spritesheet('hands_right', 'assets/character/run/Hands_side_run-Sheet6.png', { frameWidth: 14, frameHeight: 17 });
        this.load.spritesheet('hands_left', 'assets/character/run/Hands_side-left_run-Sheet6.png', { frameWidth: 14, frameHeight: 17 });
        this.load.spritesheet('hands_down', 'assets/character/run/Hands_down_run-Sheet6.png', { frameWidth: 13, frameHeight: 17 });
        this.load.spritesheet('hands_up', 'assets/character/run/Hands_up_run-Sheet6.png', { frameWidth: 13, frameHeight: 17 });

        this.load.spritesheet('main_idle_right', 'assets/character/idle/Character_side_idle_no-hands-Sheet6.png', { frameWidth: 10, frameHeight: 16 });
        this.load.spritesheet('main_idle_left', 'assets/character/idle/Character_side-left_idle_no-hands-Sheet6.png', { frameWidth: 10, frameHeight: 16 });
        this.load.spritesheet('main_idle_down', 'assets/character/idle/Character_down_idle_no-hands-Sheet6.png', { frameWidth: 11, frameHeight: 16 });
        this.load.spritesheet('main_idle_up', 'assets/character/idle/Character_up_idle_no-hands-Sheet6.png', { frameWidth: 11, frameHeight: 16 });

        this.load.spritesheet('zombie_big_right', 'assets/zombieBig/Zombie_Big_Side_Walk-Sheet8.png', { frameWidth: 16, frameHeight: 24 });
        this.load.spritesheet('zombie_big_left', 'assets/zombieBig/Zombie_Big_Side-left_Walk-Sheet8.png', { frameWidth: 16, frameHeight: 24 });
        this.load.spritesheet('zombie_big_down', 'assets/zombieBig/Zombie_Big_Down_Walk-Sheet8.png', { frameWidth: 16, frameHeight: 24 });
        this.load.spritesheet('zombie_big_up', 'assets/zombieBig/Zombie_Big_Up_Walk-Sheet8.png', { frameWidth: 16, frameHeight: 24 });

        this.load.spritesheet('zombie_axe_right', 'assets/zombieAxe/Zombie_Axe_Side_Walk-Sheet8.png', { frameWidth: 21, frameHeight: 19 });
        this.load.spritesheet('zombie_axe_left', 'assets/zombieAxe/Zombie_Axe_Side-left_Walk-Sheet8.png', { frameWidth: 21, frameHeight: 19 });
        this.load.spritesheet('zombie_axe_down', 'assets/zombieAxe/Zombie_Axe_Down_Walk-Sheet8.png', { frameWidth: 12, frameHeight: 20 });
        this.load.spritesheet('zombie_axe_up', 'assets/zombieAxe/Zombie_Axe_Up_Walk-Sheet8.png', { frameWidth: 12, frameHeight: 23 });

        this.load.spritesheet('zombie_small_right', 'assets/zombieSmall/Zombie_Small_Side_Walk-Sheet6.png', { frameWidth: 13, frameHeight: 15 });
        this.load.spritesheet('zombie_small_left', 'assets/zombieSmall/Zombie_Small_Side-left_Walk-Sheet6.png', { frameWidth: 13, frameHeight: 15 });
        this.load.spritesheet('zombie_small_down', 'assets/zombieSmall/Zombie_Small_Down_walk-Sheet6.png', { frameWidth: 12, frameHeight: 16 });
        this.load.spritesheet('zombie_small_up', 'assets/zombieSmall/Zombie_Small_Up_Walk-Sheet6.png', { frameWidth: 13, frameHeight: 16 });

        // Weapon animations
        this.load.spritesheet('bat_right_attack', 'assets/character/bat/Bat_side_attack-Sheet4.png', { frameWidth: 28, frameHeight: 16 });
        this.load.spritesheet('bat_left_attack', 'assets/character/bat/Bat_side-left_attack-Sheet4.png', { frameWidth: 28, frameHeight: 16 });
        this.load.spritesheet('bat_down_attack', 'assets/character/bat/Bat_down_attack-Sheet4.png', { frameWidth: 20, frameHeight: 25 });
        this.load.spritesheet('bat_up_attack', 'assets/character/bat/Bat_up_attack-Sheet4.png', { frameWidth: 20, frameHeight: 25 });

        this.load.spritesheet('bat_right_idle', 'assets/character/bat/Bat_side_idle-and-run-Sheet6.png', { frameWidth: 16, frameHeight: 13 });
        this.load.spritesheet('bat_left_idle', 'assets/character/bat/Bat_side-left_idle-and-run-Sheet6.png', { frameWidth: 16, frameHeight: 13 });
        this.load.spritesheet('bat_down_idle', 'assets/character/bat/Bat_down_idle-and-run-Sheet6.png', { frameWidth: 17, frameHeight: 11 });
        this.load.spritesheet('bat_up_idle', 'assets/character/bat/Bat_up_idle-and-run-Sheet6.png', { frameWidth: 16, frameHeight: 14 });

        this.load.spritesheet('gun_right_idle', 'assets/character/gun/Gun_side_idle-and-run-Sheet6.png', { frameWidth: 16, frameHeight: 10 });
        this.load.spritesheet('gun_left_idle', 'assets/character/gun/Gun_side-left_idle-and-run-Sheet6.png', { frameWidth: 16, frameHeight: 10 });
        this.load.spritesheet('gun_down_idle', 'assets/character/gun/Gun_down_idle-and-run-Sheet6.png', { frameWidth: 5, frameHeight: 16 });
        this.load.spritesheet('gun_up_idle', 'assets/character/gun/Gun_up_idle-and-run-Sheet6.png', { frameWidth: 5, frameHeight: 16 });

        // Fire
        this.load.spritesheet('fire_right', 'assets/character/fire/Fire_side-Sheet3.png', { frameWidth: 10, frameHeight: 7 });
        this.load.spritesheet('fire_left', 'assets/character/fire/Fire_side-left-Sheet3.png', { frameWidth: 10, frameHeight: 7 });
        this.load.spritesheet('fire_down', 'assets/character/fire/Fire_Down-Sheet3.png', { frameWidth: 7, frameHeight: 10 });
        this.load.spritesheet('fire_up', 'assets/character/fire/Fire_Up-Sheet3.png', { frameWidth: 7, frameHeight: 10 });


    }

    createAnimations() {
        // Globaler check, ob die schon existieren
        if (this.anims.exists('left')) return;

        // Character
        this.anims.create({ key: 'right', frames: this.anims.generateFrameNumbers('main_right', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'left', frames: this.anims.generateFrameNumbers('main_left', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'down', frames: this.anims.generateFrameNumbers('main_down', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'up', frames: this.anims.generateFrameNumbers('main_up', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });

        this.anims.create({ key: 'hands_right', frames: this.anims.generateFrameNumbers('hands_right', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'hands_left', frames: this.anims.generateFrameNumbers('hands_left', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'hands_down', frames: this.anims.generateFrameNumbers('hands_down', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'hands_up', frames: this.anims.generateFrameNumbers('hands_up', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });

        this.anims.create({ key: 'idle_right', frames: this.anims.generateFrameNumbers('main_idle_right', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'idle_left', frames: this.anims.generateFrameNumbers('main_idle_left', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'idle_down', frames: this.anims.generateFrameNumbers('main_idle_down', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'idle_up', frames: this.anims.generateFrameNumbers('main_idle_up', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });

        // Enemies
        this.anims.create({ key: 'zBigRight', frames: this.anims.generateFrameNumbers('zombie_big_right', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'zBigLeft', frames: this.anims.generateFrameNumbers('zombie_big_left', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'zBigDown', frames: this.anims.generateFrameNumbers('zombie_big_down', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'zBigUp', frames: this.anims.generateFrameNumbers('zombie_big_up', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });

        this.anims.create({ key: 'zAxeRight', frames: this.anims.generateFrameNumbers('zombie_axe_right', { start: 0, end: 7 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'zAxeLeft', frames: this.anims.generateFrameNumbers('zombie_axe_left', { start: 0, end: 7 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'zAxeDown', frames: this.anims.generateFrameNumbers('zombie_axe_down', { start: 0, end: 7 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'zAxeUp', frames: this.anims.generateFrameNumbers('zombie_axe_up', { start: 0, end: 7 }), frameRate: 6, repeat: -1 });

        this.anims.create({ key: 'zSmallRight', frames: this.anims.generateFrameNumbers('zombie_small_right', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'zSmallLeft', frames: this.anims.generateFrameNumbers('zombie_small_left', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'zSmallDown', frames: this.anims.generateFrameNumbers('zombie_small_down', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'zSmallUp', frames: this.anims.generateFrameNumbers('zombie_small_up', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });

        // Weapons
        this.anims.create({ key: 'bat_right_att', frames: this.anims.generateFrameNumbers('bat_right_attack', { start: 0, end: 3 }), frameRate: 3, repeat: -1 });
        this.anims.create({ key: 'bat_left_att', frames: this.anims.generateFrameNumbers('bat_left_attack', { start: 0, end: 3 }), frameRate: 3, repeat: -1 });
        this.anims.create({ key: 'bat_down_att', frames: this.anims.generateFrameNumbers('bat_down_attack', { start: 0, end: 3 }), frameRate: 3, repeat: -1 });
        this.anims.create({ key: 'bat_up_att', frames: this.anims.generateFrameNumbers('bat_up_attack', { start: 0, end: 3 }), frameRate: 3, repeat: -1 });

        this.anims.create({ key: 'bat_right_idle', frames: this.anims.generateFrameNumbers('bat_right_idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'bat_left_idle', frames: this.anims.generateFrameNumbers('bat_left_idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'bat_down_idle', frames: this.anims.generateFrameNumbers('bat_down_idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'bat_up_idle', frames: this.anims.generateFrameNumbers('bat_up_idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });

        this.anims.create({ key: 'gun_right_idle', frames: this.anims.generateFrameNumbers('gun_right_idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'gun_left_idle', frames: this.anims.generateFrameNumbers('gun_left_idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'gun_down_idle', frames: this.anims.generateFrameNumbers('gun_down_idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'gun_up_idle', frames: this.anims.generateFrameNumbers('gun_up_idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });

        // Fire
        this.anims.create({ key: 'fire_right', frames: this.anims.generateFrameNumbers('fire_right', { start: 0, end: 2 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'fire_left', frames: this.anims.generateFrameNumbers('fire_left', { start: 0, end: 2 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'fire_down', frames: this.anims.generateFrameNumbers('fire_down', { start: 0, end: 2 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'fire_up', frames: this.anims.generateFrameNumbers('fire_up', { start: 0, end: 2 }), frameRate: 6, repeat: -1 });

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

        // Items (Loot auf dem Boden)
        this.loot = this.physics.add.staticGroup();

        // SPIELER INSTANZIIEREN (Ersetzt die langen Physik-Blöcke)
        this.player = new Player(this, startX, startY);
        this.player.setDepth(-2);

        //Spieler in andere Szene übernehmen
        if (this.incomingPlayerdata) {
            Object.assign(this.player, this.incomingPlayerdata);

            /*const item = this.player.ownedItems[this.player.activeItemIndex];
            if (item) this.player.heldItem.setTexture(item.textureKey);
            else this.player.heldItem.setVisible(false);*/
        }


        // Falls UIScene schon läuft, stoppen und neu starten
        if (this.scene.isActive('UIScene')) {
            this.scene.stop('UIScene');
        }
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

        // Portals
        const portalObjects = map.filterObjects('Interactions', obj => obj.name === 'portal');

        this.portals = this.physics.add.staticGroup();

        portalObjects.forEach(p => {
            const zone = this.add.zone(p.x + p.width / 2, p.y + p.height / 2, p.width, p.height);
            this.physics.add.existing(zone, true);

            zone.setData('target', p.properties?.find(prop => prop.name === 'target')?.value);

            this.portals.add(zone);
        });

        this.physics.add.overlap(
            this.player,
            this.portals,
            this.enterPortal, // Callback: läuft bei Kollision
            () => Phaser.Input.Keyboard.JustDown(this.player.interactKey), // processCallback (optional, s.u.)
            this
        );


        // Zombies erstellen
        const zombieTypes = {
            // Mapping: Tiled-Name → Klasse

            zombieSmall: FastZombie,
            zombieBig: BigZombie,
            zombieAxe: AxeZombie
        };

        this.zombies = this.physics.add.group();

        const zombieObjects = map.filterObjects('Interactions', obj => obj.name in zombieTypes);

        zombieObjects.forEach(zombieData => {
            const zClass = zombieTypes[zombieData.name];

            // Create a zombie of corresponding type
            let zombie = new zClass(this, zombieData.x, zombieData.y);

            this.zombies.add(zombie);
        });

        this.zombieHealthGraphics = this.add.graphics();
        this.zombieHealthGraphics.setDepth(10);

        // Zombie Collider
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

    enterPortal(player, portal) {
        // Parameter kommen in der Reihenfolge A, B – wie beim Overlap
        console.log('Portal berührt:', portal.name);

        if (this.isTransitioning) return;
        this.isTransitioning = true;

        const target = portal.getData('target');
        this.scene.start(target, {
            playerData: {
                health: this.player.health,
                radiation: this.player.radiation,
                ownedItems: this.player.ownedItems,
                activeItemIndex: this.player.activeItemIndex
            }
        });
    }

    createDeathText() {
        this.gameOverText = this.add.text(160, 120, 'GAME OVER\nPress E to Restart', { fontSize: '24px', fill: '#ff0000', fontFamily: 'CustomFont', align: 'center', fontStyle: 'bold' });
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.setScrollFactor(0);
        this.gameOverText.setDepth(100);
        this.gameOverText.setVisible(false);

    }

    updateZombies() {
        this.zombies.children.iterate((zombie) => {
            if (!zombie || !zombie.active) return;

            zombie.chasePlayer(this.player, zombie.chaseDist);
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

    //
    dropIod(x, y) {
        const iodine = this.loot.create(x, y, 'iod');

        iodine.setData('type', 'iod');
        iodine.setData('radiation', Phaser.Math.Between(1, 6));

        return iodine;
    }

    dropMedkit(x, y) {
        const medkit = this.loot.create(x, y, 'medkit');

        medkit.setData('type', 'medkit');
        medkit.setData('heal', Phaser.Math.Between(5, 20));

        return medkit;
    }

    // Only for weapons
    spawnItem(x, y, isLoot, weaponName) {
        // If method is called to spawn new item as a loot
        if (isLoot) {
            const weaponData = new Item(weaponName, weaponName, 34, 80);

            let groundWeapon = new GroundItem(this, x, y, weaponData);

            this.items.add(groundWeapon);

        // If method is called to leave currentItem on the ground
        } else {
            const itemToDrop = this.player.ownedItems[this.player.activeItemIndex];

            let newGroundItem = new GroundItem(this, x, y, itemToDrop);

            this.items.add(newGroundItem);
        }
    }

    pickupWeapon(groundItem) {
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

    pickupLoot(loot) {
        if (loot.getData('type') === 'iod') {
            const radiHeal = loot.getData('radiation');

            this.player.decreaseRad(radiHeal);

            loot.destroy();
        }

        if (loot.getData('type') === 'medkit') {
            const heal = loot.getData('heal');

            this.player.addHealth(heal);

            loot.destroy();
        }

    }

    // ----- GAMEPLAY FUNKTIONEN -----

    destroyBullet(bullet) {
        bullet.destroy();
    }

    checkPickableNearby() {
        const maxPickupDist = 5;
        this.loot.children.iterate((loot) => {
            if (!loot || !loot.active) return;

            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, loot.x, loot.y);
            if (dist < maxPickupDist) {
                this.pickupLoot(loot);
            }
        });
    }

    checkItemInteraction() {
        const maxPickupDist = 35;
        this.items.children.iterate((item) => {
            if (!item || !item.active) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y);
            if (dist < maxPickupDist) {
                this.pickupWeapon(item);
            }
        });
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