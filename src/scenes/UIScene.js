export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    init(data) {
        this.trackedPlayer = data.player;
    }

    preload() {
        this.load.image('inv_cell', 'assets/UI/Inventory-Cell.png');
        this.load.image('inv_chosen', 'assets/UI/Inventory-Chosen.png');
    }

    create() {
        this.cameras.main.setRoundPixels(true);

        // Inventory cells
        this.cell1 = this.add.image(30, 220, 'inv_chosen');
        this.cell2 = this.add.image(50, 220, 'inv_cell');

        this.cell1.setScrollFactor(0);
        this.cell2.setScrollFactor(0);

        // Balken und Texte erstellen (ohne setScrollFactor, da die UI-Kamera sich eh nicht bewegt!)
        this.healthBar = this.add.graphics().setScrollFactor(0);
        this.healthCounter = this.add.text(18, 11, 'Health: 100', {
            fontSize: '64px', fill: '#ffffff', fontFamily: 'CustomFont' });
        this.healthCounter.setScale(0.125);

        this.radiationBar = this.add.graphics().setScrollFactor(0);
        this.radiationCounter = this.add.text(18, 26, 'Radiation: 0', {
            fontSize: '64px', fill: '#ffffff', fontFamily: 'CustomFont' });
        this.radiationCounter.setScale(0.125);

        this.weapon1 = this.add.image(30, 220, this.trackedPlayer.ownedItems[0]?.textureKey ?? 'inv_chosen');
        this.weapon2 = this.add.image(50, 220, this.trackedPlayer.ownedItems[1]?.textureKey ?? 'inv_cell');

    }

    update() {
        if (!this.trackedPlayer) return;

        // Die UI holt sich einfach die Daten live aus dem Spieler-Objekt!
        this.healthCounter.setText('Health: ' + this.trackedPlayer.health.toFixed(2));
        this.radiationCounter.setText('Radiation: ' + this.trackedPlayer.radiation.toFixed(2));

        this.drawHealthBar();
        this.drawRadiationBar();

        this.updateCounters();
    }

    updateCounters() {
        this.healthCounter.setText('Health: ' + this.trackedPlayer.health.toFixed(2));
        this.radiationCounter.setText('Radiation: ' + this.trackedPlayer.radiation.toFixed(2));
    }

    drawHealthBar() {
        // Deine bekannten drawHealthBar und drawRadiationBar Methoden...
        // Nur dass du jetzt 'this.trackedPlayer.health' statt 'this.player.health' liest
        this.healthBar.clear();
        this.healthBar.fillStyle(0x000000, 0.5);
        this.healthBar.fillRect(10, 10, 100, 10);
        const percentage = this.trackedPlayer.health / this.trackedPlayer.healthMax;
        if (percentage > 0) {
            this.healthBar.fillStyle(0xF23813, 1);
            this.healthBar.fillRect(10, 10, 100 * percentage, 10);
        }
    }

    drawRadiationBar() {
        this.radiationBar.clear();
        this.radiationBar.fillStyle(0x000000, 0.5);
        this.radiationBar.fillRect(10, 25, 100, 10);
        const percentage = this.trackedPlayer.radiation / this.trackedPlayer.radiationMax;
        if (percentage > 0) {
            this.radiationBar.fillStyle(0x13F274, 1);
            this.radiationBar.fillRect(10, 25, 100 * percentage, 10);
        }
    }

    // Select the <key> slot in the inventory bar
    selectSlot(key) {
        if (key === 0) {
            this.cell1.setTexture('inv_chosen');
            this.cell2.setTexture('inv_cell');
        } else if (key === 1) {
            this.cell1.setTexture('inv_cell');
            this.cell2.setTexture('inv_chosen');
        }
    }

    drawWeapons() {
        if (!this.weapon1 || !this.weapon2) return;  // create() lief noch nicht

        const item1 = this.trackedPlayer.ownedItems[0];
        const item2 = this.trackedPlayer.ownedItems[1];

        if (item1 != null) {
            this.weapon1.setTexture(item1.textureKey);
            this.weapon1.setVisible(true);
        } else {
            this.weapon1.setVisible(false);
        }

        if (item2 != null) {
            this.weapon2.setTexture(item2.textureKey);
            this.weapon2.setVisible(true);
        } else {
            this.weapon2.setVisible(false);
        }
    }
}