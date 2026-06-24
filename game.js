var config = {
    type: Phaser.AUTO,
    width: 320,
    height: 240,
    physics: {
        default: 'arcade',
    },
    render: {
        pixelArt: true
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#000006',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game;

document.fonts.load('16px "CustomFont"').then(() => {
    console.log('Custom Font erfolgreich geladen! Starte Spiel...');
    // Erst wenn die Schriftart bereit ist, instanziieren wir das Spiel
    game = new Phaser.Game(config);
}).catch((error) => {
    console.error('Fehler beim Laden der Schriftart', error);
    game = new Phaser.Game(config);
})

let cursors;

// Player directions
let facing;
let facingUp;

// Different game settings
const PLAYER_SPEED = 200;
const healthMax = 100;
const radiationMax = 100;
const maxZombieHealth = 100;

// Health and Radiation
let health;
let healthCounter;
let healthBar;

let radiation;
let radiationCounter;
let radiationBar;
let radFactor;

// Items & Weapons
let itemKeys;
let activeItemIndex = 0;

let ownedItemKeys;

let items;

// Projectiles
let bullets;
let spaceKey;
let lastFired = 0;

// Dying mechanic
let isDead = false;
let gameOverText;

// Enemies
let zombies;
let zombieHealthGraphics;
const ZOMBIE_SPEED = 80;

function preload ()
{
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

function create()
{
    isDead = false;
    const grid = this.add.grid(1000, 1000, 2000, 2000, 64, 64, 0x222222).setOutlineStyle(0x444444);

    // Map and Tilesets
    const map = this.make.tilemap({ key: 'map' });

    const fTileset = map.addTilesetImage('first', 'first');
    const sTileset = map.addTilesetImage('second', 'second');
    const tTileset = map.addTilesetImage('third', 'third');
    const gTileset = map.addTilesetImage('fourth', 'fourth');

    const allTilesets = [fTileset, sTileset, tTileset, gTileset];

    const backgroundLayer = map.createLayer('Background', allTilesets, 0, 0);
    const obstaclesLayer = map.createLayer('Obstacles', allTilesets, 0, 0);

    obstaclesLayer.setCollisionByExclusion([-1]);


    // Interactive Objects
    this.chests = this.physics.add.group();

    const chestObjects = map.createFromObjects('Interactions', {
        name: 'chest',
        key: 'star'
    });
    this.chests.addMultiple(chestObjects);

    this.chests.children.iterate((chest) => {
        chest.body.setImmovable(true);
        chest.setData('opened', false);
        chest.alpha = 0;
    });

    items = this.physics.add.staticGroup();


    // Player and stats
    this.player = this.physics.add.sprite(100, 300, 'main_down');
    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, obstaclesLayer);
    this.physics.add.collider(this.player, this.chests);

    health = 100;
    radiation = 0;
    radFactor = 0.001;
    

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.world.setBounds(0, 0, 2000, 2000);
    

    // Camera
    this.cameras.main.setBounds(0, 0, 2000, 2000);
    this.cameras.main.startFollow(this.player, true, 1, 1);
    this.cameras.main.setRoundPixels(true);


    // Animations
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('main_left', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('main_right', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('main_down', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('main_up', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'zLeft',
        frames: this.anims.generateFrameNumbers('zombie_left', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'zRight',
        frames: this.anims.generateFrameNumbers('zombie_right', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });


    // Health counter and bar
    healthBar = this.add.graphics();
    healthBar.setScrollFactor(0);
    drawHealthBar();

    healthCounter = this.add.text(18, 11, 'Health: 100', {
        fontSize: '8px',
        fill: '#000000',
        fontFamily: 'CustomFont'
    });
    healthCounter.setScrollFactor(0);


    // Radiation counter and bar
    radiationBar = this.add.graphics();
    radiationBar.setScrollFactor(0);
    drawRadiationBar();

    radiationCounter = this.add.text(18, 26, 'Radiation: 100', {
        fontSize: '8px',
        fill: '#000000',
        fontFamily: 'CustomFont'
    });
    radiationCounter.setScrollFactor(0);

    // Death text
    gameOverText = this.add.text(160, 120, 'GAME OVER\nPress E to Restart', {
        fontSize: '24px',
        fill: '#ff0000',
        fontFamily: 'CustomFont',
        align: 'center',
        fontStyle: 'bold'
    });
    gameOverText.setOrigin(0.5);
    gameOverText.setScrollFactor(0); // Folgt der Kamera, bleibt fix auf dem Bildschirm
    gameOverText.setDepth(100);      // Liegt über Spielern, Zombies und UI
    gameOverText.setVisible(false);

    // Interaction with Chests
    this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);


    // Items and Weapons
    //itemKeys = ['bat', 'gun', 'shotgun'];
    ownedItemKeys = ['gun'];

    this.heldItem = this.add.sprite(this.player.x, this.player.y, ownedItemKeys[activeItemIndex]);
    this.heldItem.setOrigin(0.5, 0.5);
    this.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    this.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);


    // Projectiles
    bullets = this.physics.add.group();

    this.physics.add.collider(bullets, obstaclesLayer, destroyBullet, null, this);
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


    // Enemies
    zombies = this.physics.add.group();
    const zombieObjects = map.createFromObjects('Interactions', {
        name: 'zombie',
        key: 'zombie_left',
    });

    zombies.addMultiple(zombieObjects);
    zombies.children.iterate((zombie) => {
        if (zombie.body) {
            zombie.body.setCollideWorldBounds(true);
            zombie.setData('hp', 100);
            zombie.setData('maxHp', 100);
        }
    });

    this.physics.add.collider(zombies, obstaclesLayer);
    this.physics.add.collider(zombies, zombies);
    this.physics.add.collider(this.player, zombies, handleZombieDamage, null, this);

    this.physics.add.overlap(bullets, zombies, damageZombie, null, this);

    zombieHealthGraphics = this.add.graphics();
    zombieHealthGraphics.setDepth(10); // Over the sprites


    // The latest part of create() func
    this.events.on('postupdate', () => {
        // Falls das Spiel im Game-Over-Screen ist, müssen wir die Position nicht updaten
        if (isDead) return;

        let offsetX = 11;
        let offsetY = 2;

        // Wir runden die Positionen mit Math.round(), damit sie perfekt mit dem
        // Pixel-Snapping der Kamera (setRoundPixels) übereinstimmen!
        if (facing) {
            this.heldItem.x = this.player.x + offsetX;
            this.heldItem.flipX = false;
        } else {
            this.heldItem.x = this.player.x - offsetX;
            this.heldItem.flipX = true;
        }

        this.heldItem.y = this.player.y + offsetY;
        this.heldItem.setDepth(this.player.depth + 1);
    });
}

function drawZombiesHealthBars() {
    zombieHealthGraphics.clear();

    zombies.children.iterate((zombie) => {
        if (!zombie || !zombie.active) return;

        const maxHp = zombie.getData('maxHp');
        const currentHp = zombie.getData('hp');

        const barWidth = 20;
        const barHeight = 3;

        // Positionierung: Zentriert über dem Kopf des Zombies
        // zombie.y - (zombie.height / 2) - 6 platziert den Balken knapp über dem Sprite
        const barX = zombie.x - (barWidth / 2);
        const barY = zombie.y - (zombie.displayHeight / 2) - 6;

        zombieHealthGraphics.fillStyle(0x000000, 0.6);
        zombieHealthGraphics.fillRect(barX, barY, barWidth, barHeight);

        const hpPercentage = currentHp / maxHp;
        const currentBarWidth = barWidth * hpPercentage;

        if (hpPercentage > 0) {
            zombieHealthGraphics.fillStyle(0xff0000, 1);
            zombieHealthGraphics.fillRect(barX, barY, currentBarWidth, barHeight);
        }
    })
}

function handleZombieDamage(player, zombie) {
    // Amount of damage dealt by a zombie per frame
    addHealth(-0.3);
}

function spawnItem(scene, x, y, isLoot) {
    if (isLoot) {
        let drop = items.create(x, y, 'shotgun');

        if (drop) {
            drop.setScale(0.8);

            drop.setData('pickedUp', false);
            drop.setData('type', 'shotgun');
        }
    } else {
        let layingItem = items.create(x, y, ownedItemKeys[activeItemIndex]);

        layingItem.setData('pickedUp', false);
        layingItem.setData('type', ownedItemKeys[activeItemIndex]);
    }
}

function checkLootInteraction(scene) {
    const maxPickupDist = 35;

    items.children.iterate((item) => {
        if (!item || !item.active) return;

        const dist = Phaser.Math.Distance.Between(
            scene.player.x, scene.player.y,
            item.x, item.y
        );

        if (dist < maxPickupDist && !item.getData('pickedUp')) {
            pickupItem(item);
        }
    });
}

function pickupItem(item) {
    item.setData('pickedUp', true);

    const itemType = item.getData('type');

    if (ownedItemKeys[activeItemIndex]) {
        spawnItem(game.scene.scenes[0], item.x, item.y, false);
    }

    ownedItemKeys.splice(activeItemIndex, 1, itemType);


    item.destroy();
}

function damageZombie(bullet, zombie) {
    bullet.destroy();
    let zHealth = zombie.getData('hp');

    zHealth -= 34;
    zombie.setData('hp', zHealth);

    if (zHealth > 0) {
        // dunno
    } else {
        zombie.destroy();
        spawnItem(game.scene.scenes[0], zombie.x, zombie.y, true);
    }
}

function checkChestInteraction(scene)
{
    const maxDist = 80;

    scene.chests.children.iterate((chest) => {
        const dist = Phaser.Math.Distance.Between(
            scene.player.x, scene.player.y,
            chest.x, chest.y
        );

        if (dist < maxDist && !chest.getData('opened')) {
            openChest(chest);
        }
    })
}

function openChest(chest)
{
    if (chest.getData('opened')) return;

    addHealth(-10);

    chest.setData('opened', true);
    chest.alpha = 1;
}

function drawHealthBar()
{
    healthBar.clear();

    healthBar.fillStyle(0x000000, 0.5);
    healthBar.fillRect(10, 10, 100, 10);

    const percentage = health / healthMax;
    const barWidth = 100 * percentage;

    if ( percentage > 0) {
        healthBar.fillStyle(0xF23813, 1);
        healthBar.fillRect(10, 10, barWidth, 10);
    }
}

function drawRadiationBar()
{
    radiationBar.clear();

    radiationBar.fillStyle(0x000000, 0.5);
    radiationBar.fillRect(10, 25, 100, 10);

    const percentage = radiation / radiationMax;
    const barWidth = 100 * percentage;

    if ( percentage > 0) {
        radiationBar.fillStyle(0x13F274, 1);
        radiationBar.fillRect(10, 25, barWidth, 10);
    }
}

function playerDeath(scene) {
    isDead = true;

    scene.player.setVelocity(0);
    scene.player.setTint(0xff0000);
    scene.player.anims.stop();

    zombies.children.iterate((zombie) => {
        if (zombie && zombie.body) {
            zombie.body.setVelocity(0);
        }
    });

    gameOverText.setVisible(true);

    scene.time.delayedCall(3600, () => {
        scene.scene.restart();
    });

}

function addHealth(x) {
    health += x;

    if (health <= 0) {
        health = 0;

        playerDeath(game.scene.scenes[0]);
    }

    drawHealthBar();
}

function addRad(x) {
    radiation += x;
    if (radiation < 0) radiation = 0;
    if (radiation > 100) radiation = 100;

    drawRadiationBar();
}

function updateCounters()
{
    healthCounter.setText('Health: ' + health.toFixed(2));

    addRad(radFactor);
    radiationCounter.setText('Radiation: ' + radiation.toFixed(2));
}

function itemSwitchUpdate(scene)
{
    if (Phaser.Input.Keyboard.JustDown(scene.key1)) {
        activeItemIndex = 0;
        scene.heldItem.setTexture(ownedItemKeys[activeItemIndex]);

    }
    if (Phaser.Input.Keyboard.JustDown(scene.key2)) {
        activeItemIndex = 1;
        scene.heldItem.setTexture(ownedItemKeys[activeItemIndex]);

    }

    /*let offsetX = 11; // How far to right or left from Character
    let offsetY = 2; // How far to right or left from Character


    if (facing) {
        scene.heldItem.x = scene.player.x + offsetX;
        scene.heldItem.flipX = false;
    } else {
        scene.heldItem.x = scene.player.x - offsetX;
        scene.heldItem.flipX = true;
    }

    scene.heldItem.y = scene.player.y + offsetY;
    scene.heldItem.setDepth(scene.player.depth + 1);*/
}

function updateZombies(scene) {
    const chaseDist = 300;

    zombies.children.iterate((zombie) => {
        if (!zombie || !zombie.active) return;

        const dist = Phaser.Math.Distance.Between(
            zombie.x, zombie.y,
            scene.player.x, scene.player.y
        );

        if (dist < chaseDist) {
            let directionX = scene.player.x - zombie.x;
            let directionY = scene.player.y - zombie.y;

            let vector = new Phaser.Math.Vector2(directionX, directionY).normalize();

            zombie.body.setVelocityX(vector.x * ZOMBIE_SPEED);
            zombie.body.setVelocityY(vector.y * ZOMBIE_SPEED);

            if (vector.x > 0) {
                zombie.flipX = false; // Schaut nach rechts
                zombie.anims.play('zRight', true);
            } else if (vector.x < 0) {
                zombie.flipX = false;  // Schaut nach links
                zombie.anims.play('zLeft', true);
            }
        } else {
            zombie.body.setVelocity(0);
        }
    });
}

function update ()
{
    if(isDead) {
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            this.scene.restart();
        }
        return;
    }

    updateCounters();
    updateZombies(this);
    itemSwitchUpdate(this);
    drawZombiesHealthBars();

    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
        checkChestInteraction(this);

        checkLootInteraction(this);
    }

    this.player.body.setVelocity(0);

    let moveX = 0;
    let moveY = 0;

    // Check inputs
    if (cursors.left.isDown)  {
        moveX = -1;
        this.player.anims.play('left', true);
        facing = false;
    }
    if (cursors.right.isDown) {
        moveX = 1;
        this.player.anims.play('right', true);
        facing = true;
    }
    if (cursors.up.isDown)    {
        moveY = -1;
        this.player.anims.play('up', true);
        facingUp = true;
    }
    if (cursors.down.isDown)  {
        moveY = 1;
        this.player.anims.play('down', true);
        facingUp = false;
    }

    // Normalize vector so diagonal movement isn't faster
    let vector = new Phaser.Math.Vector2(moveX, moveY).normalize();
    
    // Apply velocity
    this.player.body.setVelocityX(vector.x * PLAYER_SPEED);
    this.player.body.setVelocityY(vector.y * PLAYER_SPEED);


    if(moveX === 0 && moveY === 0) {
        this.player.anims.stop();
        if (facing) {
            this.player.setFrame(0);
        }
        else {
            this.player.setFrame(0);
        }
    }

    // Shoot implementation
    if (Phaser.Input.Keyboard.JustDown(spaceKey) && this.time.now > lastFired) {
        if (ownedItemKeys[activeItemIndex] === 'gun') {
            fireBullet(this, false);
            lastFired = this.time.now + 300; // 300ms Cooldown bis zum nächsten Schuss
        } else if (ownedItemKeys[activeItemIndex] === 'shotgun') {
            fireBullet(this, true);
            lastFired = this.time.now + 80; // 80ms Cooldown bis zum nächsten Schuss
        }
    }
    
}

function fireBullet(scene, isMultiple) {
    let bullet = bullets.create(scene.heldItem.x, scene.heldItem.y, 'bullet');
    //bullet.setScale(2, 2);

    if (bullet) {
        //bullet.setScale(0.5);

        let bulletSpeed = 400;
        if (facing) {
            bullet.body.setVelocityX(bulletSpeed);
        } else {
            bullet.body.setVelocityX(-bulletSpeed);
        }

        scene.time.delayedCall(1500, () => {
            if (bullet && bullet.active) {
                bullet.destroy();
            }
        });
    }
}

function destroyBullet(bullet, obstacle) {
    bullet.destroy();
}
