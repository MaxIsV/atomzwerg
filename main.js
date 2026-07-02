// main.js
import MenuScene from './src/scenes/MenuScene.js';
import MainScene from './src/scenes/MainScene.js';
import UIScene from "./src/scenes/UIScene.js";

const config = {
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
    scene: [MenuScene, MainScene, UIScene] // Hier wird deine neue Scene-Klasse geladen!
};

// Startet Phaser erst, wenn Font geladen ist
document.fonts.load('16px "CustomFont"').then(() => {
    console.log('Custom Font erfolgreich geladen! Starte Spiel...');
    new Phaser.Game(config);
}).catch((error) => {
    console.error('Fehler beim Laden der Schriftart', error);
    new Phaser.Game(config);
});