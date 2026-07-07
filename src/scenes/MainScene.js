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
        this.loadDefault();

        //New map textures
        this.load.image('t1', 'assets/map/Background_Bleak-Yellow_TileSet.png');
        //this.load.image('t2', 'assets/map/build.png');
        this.load.image('t3', 'assets/map/build1.png');
        this.load.image('t4', 'assets/map/buildB.png');
        this.load.image('t5', 'assets/map/buildW.png');
        this.load.image('t6', 'assets/map/road.png');
        //this.load.image('t7', 'assets/map/top objects.png');
        this.load.image('t8', 'assets/map/top objects2.png');
        this.load.image('t9', 'assets/map/greenery.png');
        //this.load.image('t10', 'assets/map/TX Props.png');
        this.load.image('t11', 'assets/map/grass.png');
        this.load.image('t12', 'assets/map/street acc.png');

        this.load.tilemapTiledJSON('map', 'assets/map/map2.tmj');
    }

    create() {
        const grid = this.add.grid(1000, 1000, 2000, 2000, 64, 64, 0x222222).setOutlineStyle(0x444444);
        grid.setDepth(-5);

        // Map aufbauen
        const map = this.make.tilemap({ key: 'map' });

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
        //const T10 = map.addTilesetImage('first', 't10');
        const T11 = map.addTilesetImage('grass', 't11');
        const T12 = map.addTilesetImage('street acc', 't12');

        const allTilesets = [T1, T3, T4, T5, T6, T8, T9, T11, T12];

        //const backgroundLayer = map.createLayer('Background', allTilesets, 0, 0);
        //this.obstaclesLayer = map.createLayer('Obstacles', allTilesets, 0, 0);
        //this.obstaclesLayer.setCollisionByExclusion([-1]);

        const backgroundLayer9 = map.createLayer('grass', allTilesets);
        const backgroundLayer8 = map.createLayer('path', allTilesets);
        const backgroundLayer7 = map.createLayer('greenery', allTilesets);

        const backgroundLayer5 = map.createLayer('greenery2', allTilesets);
        backgroundLayer8.setDepth(-4);
        backgroundLayer7.setDepth(-4);
        backgroundLayer5.setDepth(-4);
        backgroundLayer9.setDepth(-4);


        /*this.player = new Player(this, 100, 300);
        this.player.setDepth(-2);*/

        const backgroundLayer6 = map.createLayer('trees', allTilesets);
        const backgroundLayer4 = map.createLayer('building top', allTilesets);
        const backgroundLayer3 = map.createLayer('vehicles bottom', allTilesets);
        const backgroundLayer2 = map.createLayer('building bottom', allTilesets);
        const backgroundLayer1 = map.createLayer('building accessory', allTilesets);
        const backgroundLayer10 = map.createLayer('street acc', allTilesets);


        this.collisionGroup = this.physics.add.staticGroup();

        this.collisionLayer = map.getObjectLayer('collisions');


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
        this.checkPickableNearby();

        // Interaktionen
        if (Phaser.Input.Keyboard.JustDown(this.player.interactKey)) {
            this.checkChestInteraction();

            // Pickup von Medkit oder Jod
            this.checkItemInteraction();
        }
    }
}