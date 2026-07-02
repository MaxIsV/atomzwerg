export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    init(data) {
        this.trackedPlayer = data.player;
    }

    create() {
        this.cameras.main.setRoundPixels(true);

        // Balken und Texte erstellen (ohne setScrollFactor, da die UI-Kamera sich eh nicht bewegt!)
        this.healthBar = this.add.graphics().setScrollFactor(0);
        this.healthCounter = this.add.text(18, 11, 'Health: 100', {
            fontSize: '64px', fill: '#ffffff', fontFamily: 'CustomFont' });
        this.healthCounter.setScale(0.125);

        this.radiationBar = this.add.graphics().setScrollFactor(0);
        this.radiationCounter = this.add.text(18, 26, 'Radiation: 0', {
            fontSize: '64px', fill: '#ffffff', fontFamily: 'CustomFont' });
        this.radiationCounter.setScale(0.125);
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
}