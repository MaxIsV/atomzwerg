import BaseLevelScene from "./BaseLevelScene.js";

export default class Level1 extends BaseLevelScene {
    constructor() {
        super('level1');
    }

    preload() {
        // HIER KOMMT DEIN GANZER PRELOAD-BLOCK REIN:
        this.loadDefault();

        this.load.image('g1', 'assets/level1/background.png');
        this.load.image('g2', 'assets/level1/buildB.png');
        this.load.image('g3', 'assets/level1/grass.png');
        this.load.image('g4', 'assets/level1/greenery.png');
        this.load.image('g5', 'assets/level1/road.png');
        this.load.image('g6', 'assets/level1/street acc.png');
        this.load.image('g7', 'assets/level1/street acc2.png');
        this.load.image('g8', 'assets/level1/top objects2.png');
        this.load.image('g9', 'assets/level1/top objects3.png');

        this.load.tilemapTiledJSON('level1', 'assets/level1/level2.tmj');
    }

    create() {
        //const grid = this.add.grid(1000, 1000, 2000, 2000, 64, 64, 0x222222).setOutlineStyle(0x444444);
        //grid.setDepth(-5);

        const map = this.make.tilemap({ key: 'level1' });

        const T1 = map.addTilesetImage('background', 'g1');
        const T2 = map.addTilesetImage('buildB', 'g2');
        const T3 = map.addTilesetImage('grass', 'g3');
        const T4 = map.addTilesetImage('greenery', 'g4');
        const T5 = map.addTilesetImage('road', 'g5');
        const T6 = map.addTilesetImage('street acc', 'g6');
        const T7 = map.addTilesetImage('street acc2', 'g7');
        const T8 = map.addTilesetImage('top objects2', 'g8');
        const T9 = map.addTilesetImage('top objects3', 'g9');

        const allTsets = [T1, T2, T3, T4, T5, T6, T7, T8, T9];

        const bLayer9 = map.createLayer('grass', allTsets);
        const bLayer8 = map.createLayer('path', allTsets);
        const bLayer7 = map.createLayer('greenery', allTsets);
        const bLayer6 = map.createLayer('build', allTsets);
        const bLayer5 = map.createLayer('building top', allTsets);
        const bLayer4 = map.createLayer('vehicles bottom', allTsets);
        const bLayer3 = map.createLayer('vehicles', allTsets);
        const bLayer2 = map.createLayer('street acc', allTsets);
        const bLayer1 = map.createLayer('trees', allTsets);

        bLayer9.setDepth(-4);
        bLayer8.setDepth(-4);
        bLayer7.setDepth(-4);


        this.collisionGroup = this.physics.add.staticGroup();

        this.collisionLayer = map.getObjectLayer('collisions');

        const npcData = map.findObject('interactions', obj => obj.name === 'daughter');

        if (npcData) {
            this.docha = this.physics.add.staticSprite(npcData.x, npcData.y, 'docha');
        }

        this.setupLevel(map, 120, 40);

        this.physics.add.collider(this.player, this.docha, this.foundDaughter, null, this);
    }

    update() {
        this.defaultUpdate();
    }

    foundDaughter() {
        this.player.win();

        this.zombies.children.iterate((zombie) => {
            if (zombie && zombie.body) zombie.body.setVelocity(0);
        });

        this.zombieHealthGraphics.clear();

        this.winText.setVisible(true);

        this.sound.stopAll();
        this.sound.add('bgWon', { loop: true, volume: 1.5 }).play();
    }
}