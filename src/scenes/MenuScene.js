// MenuScene.js
export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' }); // Einzigartiger Name der Szene
    }

    preload() {
        this.load.image('button', 'assets/UI/Play_Not-Pressed.png');
    }

    create() {
        let playButton = this.add.image(220, 120, 'button').setInteractive();

        // Wenn der Button geklickt wird, starte das eigentliche Spiel
        playButton.on('pointerdown', () => {
            this.scene.start('MainScene'); // Wechselt zur MainScene
        });
    }
}