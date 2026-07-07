import BaseLevelScene from "./BaseLevelScene.js";

export default class Level1 extends BaseLevelScene {
    constructor() {
        super('level1');
    }

    preload() {
        // HIER KOMMT DEIN GANZER PRELOAD-BLOCK REIN:
        this.loadDefault();

        this.load.image('g1', 'assets/level1/floor.png');
        this.load.image('g2', 'assets/level1/walls.png');

        this.load.tilemapTiledJSON('level1', 'assets/level1/level1.tmj');
    }

    create() {
        const grid = this.add.grid(1000, 1000, 2000, 2000, 64, 64, 0x222222).setOutlineStyle(0x444444);
        grid.setDepth(-5);

        const map = this.make.tilemap({ key: 'level1' });

        const T1 = map.addTilesetImage('floor', 'g1');
        const T2 = map.addTilesetImage('walls', 'g2');

        const allTilesets = [T1, T2];

        const backgroundLayer1 = map.createLayer('floor', allTilesets);
        const backgroundLayer2 = map.createLayer('walls', allTilesets);
        backgroundLayer1.setDepth(-4);
        backgroundLayer2.setDepth(-4);


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