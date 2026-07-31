// MenuScene.js
export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' }); // Einzigartiger Name der Szene
    }

    preload() {
        this.load.image('button', 'assets/UI/Play_Not-Pressed.png');
        this.load.image('background', 'assets/UI/MainScreenshotCropped.png');
    }

    create() {

        // Add background as HTML Element to avoid downscaling
        const container = document.getElementById('game-container');
        if (container) {
            container.style.backgroundImage = "url('assets/UI/MainScreenshotCropped.png')";
        }

        let playButton = this.add.image(220, 208, 'button').setInteractive();

        // Game name text with shadow
        this.nameTextShadow = this.add.text(222, 32, 'Atomzwerg', { fontSize: '96px', fill: '#000000', fontFamily: 'CustomFont', align: 'center', fontStyle: 'bold' });
        this.nameTextShadow.setOrigin(0.5);
        this.nameTextShadow.setScale(0.25);
        this.nameText = this.add.text(220, 30, 'Atomzwerg', { fontSize: '96px', fill: '#0cd36f', fontFamily: 'CustomFont', align: 'center', fontStyle: 'bold' });
        this.nameText.setOrigin(0.5);
        this.nameText.setScale(0.25);

        // Instructions
        this.manualRect = this.add.graphics();
        this.manualRect.fillStyle(0x2d2d2d, 0.7);
        this.manualRect.fillRect(293, 10, 144, 220);

        /*this.manualText = this.add.text(300, 15, 'Find your daughter! Slaughter \nzombies and avoid radiation.\n\n| Controls |\nMove - [WASD] \nPunch and Shoot - [Space]\nInteract - [E] to pickup\na Weapon or open a Barrel\nSelect weapon slot - [1] or [2]\n',
            { fontSize: '64px', fill: '#ffffff', fontFamily: 'CustomFont', align: 'left' });*/
        //this.manualText.setScale(0.125);

        const manualText = this.add.rexBBCodeText(298, 15,
            'You have to find your daughter,\n' +
            'but the time is against you.\n' +
            'The world is full of [color=#4cd324]radiation[/color], so\n' +
            'avoid affected areas and kill\n' +
            'zombies to obtain helpful loot:\n' +
            '\n' +
            '[color=yellow]#Iodine[/color] - reduces radiation\n' +
            '[color=yellow]#Medkit[/color] - heals you\n' +
            '[color=yellow]#Firearms[/color] - helps in the fight\n' +
            '\n' +
            'You can open some barrels and\n' +
            'get a chance for better loot\n' +
            '\n' +
            '\n' +
            '\n' +
            'Tip: Find the gap in the fence\n' +
            'to move on.\n' +
            '\n' +
            '[color=red]| Controls |[/color]\n' +
            '#Move - [color=yellow]keyboard arrows[/color]\n' +
            '#Punch and Shoot - [color=yellow][Space][/color]\n' +
            '#Interact - [color=yellow][E][/color] to pickup\n' +
            'a Weapon or open a Barrel\n' +
            '#Select weapon slot - [color=yellow][1][/color] or [color=yellow][2][/color]\n',
            { fontSize: '64px',  fontFamily: 'CustomFont',  color: '#ffffff' }).setScale(0.125);


        // Wenn der Button geklickt wird, starte das eigentliche Spiel
        playButton.on('pointerdown', () => {
            this.scene.start('MainScene'); // Wechselt zur MainScene
        });
    }
}