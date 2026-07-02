// MainScene.js
import Player from '../entities/Player.js';
import FastZombie from "../entities/FastZombie.js";
import BaseLevelScene from "./BaseLevelScene.js";

export default class MainScene extends BaseLevelScene {
    constructor() {
        super('MainScene' );
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

        //New map textures
        this.load.image('t1', 'assets/map/Background_Bleak-Yellow_TileSet.png');
        this.load.image('t2', 'assets/map/build.png');
        this.load.image('t3', 'assets/map/build1.png');
        this.load.image('t4', 'assets/map/Buildings_beige_TileSet.png');
        this.load.image('t5', 'assets/map/Buildings_white_TileSet.png');
        this.load.image('t6', 'assets/map/road.png');
        this.load.image('t7', 'assets/map/top objects.png');
        this.load.image('t8', 'assets/map/top objects2.png');
        this.load.image('t9', 'assets/map/trees.png');
        this.load.image('t10', 'assets/map/TX Props.png');
        this.load.image('t11', 'assets/map/TX Tileset Grass.png');

        this.load.tilemapTiledJSON('map', 'assets/map/map2.tmj');
    }

    create() {
        const grid = this.add.grid(1000, 1000, 2000, 2000, 64, 64, 0x222222).setOutlineStyle(0x444444);

        // Map aufbauen
        const map = this.make.tilemap({ key: 'map' });
        /*const fTileset = map.addTilesetImage('first', 'first');
        const sTileset = map.addTilesetImage('second', 'second');
        const tTileset = map.addTilesetImage('third', 'third');
        const gTileset = map.addTilesetImage('fourth', 'fourth');
        const allTilesets = [fTileset, sTileset, tTileset, gTileset];*/


        //New map
        const T1 = map.addTilesetImage('third', 't1');
        //const T2 = map.addTilesetImage('t2', 't2');
        const T3 = map.addTilesetImage('second', 't3');
        const T4 = map.addTilesetImage('buildB', 't4');
        const T5 = map.addTilesetImage('buildW', 't5');
        const T6 = map.addTilesetImage('road', 't6');
        //const T7 = map.addTilesetImage('t7', 't7');
        const T8 = map.addTilesetImage('top', 't8');
        const T9 = map.addTilesetImage('trees', 't9');
        const T10 = map.addTilesetImage('first', 't10');
        const T11 = map.addTilesetImage('grass', 't11');

        const allTilesets = [T1, T3, T4, T5, T6, T8, T9, T10, T11];

        //const backgroundLayer = map.createLayer('Background', allTilesets, 0, 0);
        //this.obstaclesLayer = map.createLayer('Obstacles', allTilesets, 0, 0);
        //this.obstaclesLayer.setCollisionByExclusion([-1]);

        const backgroundLayer8 = map.createLayer('grass', allTilesets);
        const backgroundLayer7 = map.createLayer('path', allTilesets);
        const backgroundLayer6 = map.createLayer('greenery', allTilesets);
        const backgroundLayer4 = map.createLayer('greenery2', allTilesets);

        this.player = new Player(this, 100, 300);

        const backgroundLayer5 = map.createLayer('building top', allTilesets);
        const backgroundLayer3 = map.createLayer('vehicles bottom', allTilesets);
        const backgroundLayer2 = map.createLayer('building bottom', allTilesets);
        const backgroundLayer1 = map.createLayer('building top accessory', allTilesets);


        this.collisionGroup = this.physics.add.staticGroup();

        this.collisionLayer = map.getObjectLayer('colisions');



        //this.obstaclesLayer = map.createLayer('colisions', allTilesets, 0, 0);
        //this.obstaclesLayer.setCollisionByExclusion([-1]);

        this.setupLevel(map, 100, 300);
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
        this.updateZombies();
        this.drawZombiesHealthBars();

        // Interaktionen
        if (Phaser.Input.Keyboard.JustDown(this.player.interactKey)) {
            this.checkChestInteraction();
            this.checkLootInteraction();
        }
    }

    // ----- GAMEPLAY FUNKTIONEN -----

    destroyBullet(bullet) {
        bullet.destroy();
    }

    checkLootInteraction() {
        const maxPickupDist = 35;
        this.items.children.iterate((item) => {
            if (!item || !item.active) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y);
            if (dist < maxPickupDist) {
                this.pickupItem(item);
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