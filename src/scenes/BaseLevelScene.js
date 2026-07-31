import Player from "../entities/Player.js";
import FastZombie from "../entities/FastZombie.js";
import Item from "../entities/Item.js";
import GroundItem from "../entities/GroundItem.js";
import BigZombie from "../entities/BigZombie.js";
import AxeZombie from "../entities/AxeZombie.js";

export default class BaseLevelScene extends Phaser.Scene {
    constructor(key) {
        super({ key: key });
    }

    init(data) {
        this.incomingPlayerdata = data.playerData ?? null;

        this.isTransitioning = false;   // frisch bei jedem Szenen-Start
    }

    loadDefault() {
        this.load.image('star', 'assets/star.png');
        //this.load.image('bomb', 'assets/bomb.png');

        this.load.image('gun', 'assets/items/Gun.png');
        this.load.image('shotgun', 'assets/items/Shotgun.png');
        this.load.image('bat', 'assets/items/Bat.png');
        this.load.image('bullet', 'assets/character/fire/Gun-bullet_Bullet.png');
        this.load.image('medkit', 'assets/items/Bandage.png');
        this.load.image('iod', 'assets/items/Iod.png');

        this.load.image('barrel_blue', 'assets/barrels_opened/barrel_blue.png');
        this.load.image('barrel_blue_rust', 'assets/barrels_opened/barrel_rust_blue.png');
        this.load.image('barrel_red', 'assets/barrels_opened/barrel_red.png');
        this.load.image('barrel_red_rust', 'assets/barrels_opened/barrel_rust_red.png');

        this.load.image('docha', 'assets/character/docha.png');

        this.load.spritesheet('main_death_right', 'assets/character/Character_side_death3-Sheet7.png', { frameWidth: 21, frameHeight: 16 });
        this.load.spritesheet('main_death_left', 'assets/character/Character_side-left_death3-Sheet7.png', { frameWidth: 21, frameHeight: 16 });

        this.load.spritesheet('main_right', 'assets/character/run/Character_side_run_no-hands-Sheet6.png', { frameWidth: 10, frameHeight: 17 });
        this.load.spritesheet('main_left', 'assets/character/run/Character_side-left_run_no-hands-Sheet6.png', { frameWidth: 10, frameHeight: 17 });
        this.load.spritesheet('main_down', 'assets/character/run/Character_down_run_no-hands-Sheet6.png', { frameWidth: 11, frameHeight: 17 });
        this.load.spritesheet('main_up', 'assets/character/run/Character_up_run_no-hands-Sheet6.png', { frameWidth: 11, frameHeight: 17 });

        this.load.spritesheet('hands_right', 'assets/character/run/Hands_side_run-Sheet6.png', { frameWidth: 14, frameHeight: 17 });
        this.load.spritesheet('hands_left', 'assets/character/run/Hands_side-left_run-Sheet6.png', { frameWidth: 14, frameHeight: 17 });
        this.load.spritesheet('hands_down', 'assets/character/run/Hands_down_run-Sheet6.png', { frameWidth: 13, frameHeight: 17 });
        this.load.spritesheet('hands_up', 'assets/character/run/Hands_up_run-Sheet6.png', { frameWidth: 13, frameHeight: 17 });

        this.load.spritesheet('hands_idle_right', 'assets/character/idle/Hands_Side_idle-Sheet6.png', { frameWidth: 12, frameHeight: 16 });
        this.load.spritesheet('hands_idle_left', 'assets/character/idle/Hands_Side-left_idle-Sheet6.png', { frameWidth: 12, frameHeight: 16 });
        this.load.spritesheet('hands_idle_down', 'assets/character/idle/Hands_down_idle-Sheet6.png', { frameWidth: 13, frameHeight: 16 });
        this.load.spritesheet('hands_idle_up', 'assets/character/idle/Hands_Up_idle-Sheet6.png', { frameWidth: 11, frameHeight: 16 });

        this.load.spritesheet('main_idle_right', 'assets/character/idle/Character_side_idle_no-hands-Sheet6.png', { frameWidth: 10, frameHeight: 16 });
        this.load.spritesheet('main_idle_left', 'assets/character/idle/Character_side-left_idle_no-hands-Sheet6.png', { frameWidth: 10, frameHeight: 16 });
        this.load.spritesheet('main_idle_down', 'assets/character/idle/Character_down_idle_no-hands-Sheet6.png', { frameWidth: 11, frameHeight: 16 });
        this.load.spritesheet('main_idle_up', 'assets/character/idle/Character_up_idle_no-hands-Sheet6.png', { frameWidth: 11, frameHeight: 16 });


        // Zombies
        this.load.spritesheet('zombie_big_death_right', 'assets/zombieBig/Zombie_Big_Side_Second-Death-Sheet8.png', { frameWidth: 29, frameHeight: 24 });
        this.load.spritesheet('zombie_big_death_left', 'assets/zombieBig/Zombie_Big_Side-left_Second-Death-Sheet8.png', { frameWidth: 29, frameHeight: 24 });

        this.load.spritesheet('zombie_big_right', 'assets/zombieBig/Zombie_Big_Side_Walk-Sheet8.png', { frameWidth: 16, frameHeight: 24 });
        this.load.spritesheet('zombie_big_left', 'assets/zombieBig/Zombie_Big_Side-left_Walk-Sheet8.png', { frameWidth: 16, frameHeight: 24 });
        this.load.spritesheet('zombie_big_down', 'assets/zombieBig/Zombie_Big_Down_Walk-Sheet8.png', { frameWidth: 16, frameHeight: 24 });
        this.load.spritesheet('zombie_big_up', 'assets/zombieBig/Zombie_Big_Up_Walk-Sheet8.png', { frameWidth: 16, frameHeight: 24 });

        this.load.spritesheet('zombie_big_att_right', 'assets/zombieBig/Zombie_Big_Side_Second-Attack-Sheet15.png', { frameWidth: 30, frameHeight: 23 });
        this.load.spritesheet('zombie_big_att_left', 'assets/zombieBig/Zombie_Big_Side-left_Second-Attack-Sheet15.png', { frameWidth: 30, frameHeight: 23 });
        this.load.spritesheet('zombie_big_att_down', 'assets/zombieBig/Zombie_Big_Down_Second-Attack-Sheet15.png', { frameWidth: 22, frameHeight: 30 });
        this.load.spritesheet('zombie_big_att_up', 'assets/zombieBig/Zombie_Big_Up_Second-Attack-Sheet15.png', { frameWidth: 27, frameHeight: 24 });

        this.load.spritesheet('zombie_big_idle_right', 'assets/zombieBig/Zombie_Big_Side_Idle-Sheet6.png', { frameWidth: 16, frameHeight: 22 });
        this.load.spritesheet('zombie_big_idle_left', 'assets/zombieBig/Zombie_Big_Side-left_Idle-Sheet6.png', { frameWidth: 16, frameHeight: 22 });
        this.load.spritesheet('zombie_big_idle_down', 'assets/zombieBig/Zombie_Big_Down_Idle-Sheet6.png', { frameWidth: 16, frameHeight: 23 });
        this.load.spritesheet('zombie_big_idle_up', 'assets/zombieBig/Zombie_Big_Up_Idle-Sheet6.png', { frameWidth: 16, frameHeight: 22 });


        this.load.spritesheet('zombie_axe_death_right', 'assets/zombieAxe/Zombie_Axe_Side_Second-Death-Sheet7.png', { frameWidth: 27, frameHeight: 20 });
        this.load.spritesheet('zombie_axe_death_left', 'assets/zombieAxe/Zombie_Axe_Side-left_Second-Death-Sheet7.png', { frameWidth: 27, frameHeight: 20 });

        this.load.spritesheet('zombie_axe_right', 'assets/zombieAxe/Zombie_Axe_Side_Walk-Sheet8.png', { frameWidth: 21, frameHeight: 19 });
        this.load.spritesheet('zombie_axe_left', 'assets/zombieAxe/Zombie_Axe_Side-left_Walk-Sheet8.png', { frameWidth: 21, frameHeight: 19 });
        this.load.spritesheet('zombie_axe_down', 'assets/zombieAxe/Zombie_Axe_Down_Walk-Sheet8.png', { frameWidth: 12, frameHeight: 20 });
        this.load.spritesheet('zombie_axe_up', 'assets/zombieAxe/Zombie_Axe_Up_Walk-Sheet8.png', { frameWidth: 12, frameHeight: 23 });

        this.load.spritesheet('zombie_axe_att_right', 'assets/zombieAxe/Zombie_Axe_Side_First-Attack-Sheet7.png', { frameWidth: 25, frameHeight: 19 });
        this.load.spritesheet('zombie_axe_att_left', 'assets/zombieAxe/Zombie_Axe_Side-left_First-Attack-Sheet7.png', { frameWidth: 25, frameHeight: 19 });
        this.load.spritesheet('zombie_axe_att_down', 'assets/zombieAxe/Zombie_Axe_Down_First-Attack-Sheet7.png', { frameWidth: 15, frameHeight: 21 });
        this.load.spritesheet('zombie_axe_att_up', 'assets/zombieAxe/Zombie_Axe_Up_First-Attack-Sheet7.png', { frameWidth: 13, frameHeight: 25 });

        this.load.spritesheet('zombie_axe_idle_right', 'assets/zombieAxe/Zombie_Axe_Side_Idle-Sheet6.png', { frameWidth: 22, frameHeight: 18 });
        this.load.spritesheet('zombie_axe_idle_left', 'assets/zombieAxe/Zombie_Axe_Side-left_Idle-Sheet6.png', { frameWidth: 22, frameHeight: 18 });
        this.load.spritesheet('zombie_axe_idle_down', 'assets/zombieAxe/Zombie_Axe_Down_Idle-Sheet6.png', { frameWidth: 13, frameHeight: 18 });
        this.load.spritesheet('zombie_axe_idle_up', 'assets/zombieAxe/Zombie_Axe_Up_Idle-Sheet6.png', { frameWidth: 12, frameHeight: 23 });


        this.load.spritesheet('zombie_small_death_right', 'assets/zombieSmall/Zombie_Small_Side_Second-Death-Sheet7.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('zombie_small_death_left', 'assets/zombieSmall/Zombie_Small_Side-left_Second-Death-Sheet7.png', { frameWidth: 16, frameHeight: 16 });

        this.load.spritesheet('zombie_small_right', 'assets/zombieSmall/Zombie_Small_Side_Walk-Sheet6.png', { frameWidth: 13, frameHeight: 15 });
        this.load.spritesheet('zombie_small_left', 'assets/zombieSmall/Zombie_Small_Side-left_Walk-Sheet6.png', { frameWidth: 13, frameHeight: 15 });
        this.load.spritesheet('zombie_small_down', 'assets/zombieSmall/Zombie_Small_Down_walk-Sheet6.png', { frameWidth: 12, frameHeight: 16 });
        this.load.spritesheet('zombie_small_up', 'assets/zombieSmall/Zombie_Small_Up_Walk-Sheet6.png', { frameWidth: 13, frameHeight: 16 });

        this.load.spritesheet('zombie_small_att_right', 'assets/zombieSmall/Zombie_Small_Side_First-Attack-Sheet4.png', { frameWidth: 11, frameHeight: 14 });
        this.load.spritesheet('zombie_small_att_left', 'assets/zombieSmall/Zombie_Small_Side-left_First-Attack-Sheet4.png', { frameWidth: 11, frameHeight: 14 });
        this.load.spritesheet('zombie_small_att_down', 'assets/zombieSmall/Zombie_Small_Down_First-Attack-Sheet4.png', { frameWidth: 13, frameHeight: 16 });
        this.load.spritesheet('zombie_small_att_up', 'assets/zombieSmall/Zombie_Small_Up_First-Attack-Sheet4.png', { frameWidth: 14, frameHeight: 15 });

        this.load.spritesheet('zombie_small_idle_right', 'assets/zombieSmall/Zombie_Small_Side_Idle-Sheet6.png', { frameWidth: 11, frameHeight: 15 });
        this.load.spritesheet('zombie_small_idle_left', 'assets/zombieSmall/Zombie_Small_Side-left_Idle-Sheet6.png', { frameWidth: 11, frameHeight: 15 });
        this.load.spritesheet('zombie_small_idle_down', 'assets/zombieSmall/Zombie_Small_Down_Idle-Sheet6.png', { frameWidth: 13, frameHeight: 16 });
        this.load.spritesheet('zombie_small_idle_up', 'assets/zombieSmall/Zombie_Small_Up_Idle-Sheet6.png', { frameWidth: 13, frameHeight: 15 });


        // Weapons
        this.load.spritesheet('bat_right_attack', 'assets/character/bat/Bat_side_attack-Sheet4.png', { frameWidth: 28, frameHeight: 16 });
        this.load.spritesheet('bat_left_attack', 'assets/character/bat/Bat_side-left_attack-Sheet4.png', { frameWidth: 28, frameHeight: 16 });
        this.load.spritesheet('bat_down_attack', 'assets/character/bat/Bat_down_attack-Sheet4.png', { frameWidth: 20, frameHeight: 25 });
        this.load.spritesheet('bat_up_attack', 'assets/character/bat/Bat_up_attack-Sheet4.png', { frameWidth: 20, frameHeight: 25 });

        this.load.spritesheet('bat_right_idle', 'assets/character/bat/Bat_side_idle-and-run-Sheet6.png', { frameWidth: 16, frameHeight: 13 });
        this.load.spritesheet('bat_left_idle', 'assets/character/bat/Bat_side-left_idle-and-run-Sheet6.png', { frameWidth: 16, frameHeight: 13 });
        this.load.spritesheet('bat_down_idle', 'assets/character/bat/Bat_down_idle-and-run-Sheet6.png', { frameWidth: 17, frameHeight: 11 });
        this.load.spritesheet('bat_up_idle', 'assets/character/bat/Bat_up_idle-and-run-Sheet6.png', { frameWidth: 16, frameHeight: 14 });


        this.load.spritesheet('gun_right_idle', 'assets/character/gun/Gun_side_idle-and-run-Sheet6.png', { frameWidth: 16, frameHeight: 10 });
        this.load.spritesheet('gun_left_idle', 'assets/character/gun/Gun_side-left_idle-and-run-Sheet6.png', { frameWidth: 16, frameHeight: 10 });
        this.load.spritesheet('gun_down_idle', 'assets/character/gun/Gun_down_idle-and-run-Sheet6.png', { frameWidth: 5, frameHeight: 16 });
        this.load.spritesheet('gun_up_idle', 'assets/character/gun/Gun_up_idle-and-run-Sheet6.png', { frameWidth: 5, frameHeight: 16 });

        this.load.spritesheet('gun_shoot_right', 'assets/character/gun/Gun_side_shoot-Sheet3.png', { frameWidth: 18, frameHeight: 10 });
        this.load.spritesheet('gun_shoot_left', 'assets/character/gun/Gun_side-left_shoot-Sheet3.png', { frameWidth: 18, frameHeight: 10 });
        this.load.spritesheet('gun_shoot_down', 'assets/character/gun/Gun_down_shoot-Sheet3.png', { frameWidth: 5, frameHeight: 17 });
        this.load.spritesheet('gun_shoot_up', 'assets/character/gun/Gun_up_shoot-Sheet3.png', { frameWidth: 5, frameHeight: 17 });


        this.load.spritesheet('shotgun_right_idle', 'assets/character/shotgun/Shotgun_side_idle-and-run-Sheet6.png', { frameWidth: 15, frameHeight: 8 });
        this.load.spritesheet('shotgun_left_idle', 'assets/character/shotgun/Shotgun_side-left_idle-and-run-Sheet6.png', { frameWidth: 15, frameHeight: 8 });
        this.load.spritesheet('shotgun_down_idle', 'assets/character/shotgun/Shotgun_down_idle-and-run-Sheet6.png', { frameWidth: 6, frameHeight: 14 });
        this.load.spritesheet('shotgun_up_idle', 'assets/character/shotgun/Shotgun_up_idle-and-run-Sheet6.png', { frameWidth: 6, frameHeight: 16 });

        this.load.spritesheet('shotgun_shoot_right', 'assets/character/shotgun/Shotgun_side_shoot-Sheet3.png', { frameWidth: 18, frameHeight: 8 });
        this.load.spritesheet('shotgun_shoot_left', 'assets/character/shotgun/Shotgun_side-left_shoot-Sheet3.png', { frameWidth: 18, frameHeight: 8 });
        this.load.spritesheet('shotgun_shoot_down', 'assets/character/shotgun/Shotgun_down_shoot-Sheet3.png', { frameWidth: 6, frameHeight: 15 });
        this.load.spritesheet('shotgun_shoot_up', 'assets/character/shotgun/Shotgun_up_shoot-Sheet3.png', { frameWidth: 6, frameHeight: 17 });

        // Fire
        this.load.spritesheet('fire_right', 'assets/character/fire/Fire_side-Sheet3.png', { frameWidth: 10, frameHeight: 7 });
        this.load.spritesheet('fire_left', 'assets/character/fire/Fire_side-left-Sheet3.png', { frameWidth: 10, frameHeight: 7 });
        this.load.spritesheet('fire_down', 'assets/character/fire/Fire_Down-Sheet3.png', { frameWidth: 7, frameHeight: 10 });
        this.load.spritesheet('fire_up', 'assets/character/fire/Fire_Up-Sheet3.png', { frameWidth: 7, frameHeight: 10 });




        // SOUNDS

        this.load.audio('bat_hit', 'assets/sounds/bat_hit.mp3');
        this.load.audio('barrel', 'assets/sounds/barrel.mp3');
        this.load.audio('zombie_attack', 'assets/sounds/zombie_attack.wav');
        this.load.audio('zSmall_death', 'assets/sounds/zombie_death_small.wav');
        this.load.audio('zBig_death', 'assets/sounds/zombie_death_big.mp3');
        this.load.audio('zAxe_death', 'assets/sounds/zombie_death_axe.wav');

        this.load.audio('gun_shoot', 'assets/sounds/gun.mp3');
        this.load.audio('shotgun_shoot', 'assets/sounds/rusty_gun.wav');

        this.load.audio('bgMusic', 'assets/sounds/background_theme.mp3');
        this.load.audio('bgWon', 'assets/sounds/bgWon.mp3');
        this.load.audio('bgLost', 'assets/sounds/bgLost.wav');

    }

    playBackground() {
        // Lost-Musik entfernen, falls vom letzten Tod noch da
        this.sound.removeByKey('bgLost');
        this.sound.removeByKey('bgWon');

        // Level-Musik: neu starten oder erstellen
        const music = this.sound.get('bgMusic');
        if (music) {
            music.stop();
            music.play();
        } else {
            this.sound.add('bgMusic', { loop: true, volume: 2 }).play();
        }
    }

    createAnimations() {
        // Globaler check, ob die schon existieren
        if (this.anims.exists('left')) return;

        // Character
        this.anims.create({ key: 'main_death_right', frames: this.anims.generateFrameNumbers('main_death_right', { start: 0, end: 6 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'main_death_left', frames: this.anims.generateFrameNumbers('main_death_left', { start: 0, end: 6 }), frameRate: 6, repeat: 0 });

        this.anims.create({ key: 'right', frames: this.anims.generateFrameNumbers('main_right', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'left', frames: this.anims.generateFrameNumbers('main_left', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'down', frames: this.anims.generateFrameNumbers('main_down', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'up', frames: this.anims.generateFrameNumbers('main_up', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });

        this.anims.create({ key: 'hands_right', frames: this.anims.generateFrameNumbers('hands_right', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'hands_left', frames: this.anims.generateFrameNumbers('hands_left', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'hands_down', frames: this.anims.generateFrameNumbers('hands_down', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'hands_up', frames: this.anims.generateFrameNumbers('hands_up', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });

        this.anims.create({ key: 'hands_idle_right', frames: this.anims.generateFrameNumbers('hands_idle_right', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'hands_idle_left', frames: this.anims.generateFrameNumbers('hands_idle_left', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'hands_idle_down', frames: this.anims.generateFrameNumbers('hands_idle_down', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'hands_idle_up', frames: this.anims.generateFrameNumbers('hands_idle_up', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });

        this.anims.create({ key: 'idle_right', frames: this.anims.generateFrameNumbers('main_idle_right', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'idle_left', frames: this.anims.generateFrameNumbers('main_idle_left', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'idle_down', frames: this.anims.generateFrameNumbers('main_idle_down', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'idle_up', frames: this.anims.generateFrameNumbers('main_idle_up', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });

        // Enemies
        this.anims.create({ key: 'zBig_death_right', frames: this.anims.generateFrameNumbers('zombie_big_death_right', { start: 0, end: 7 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'zBig_death_left', frames: this.anims.generateFrameNumbers('zombie_big_death_left', { start: 0, end: 7 }), frameRate: 6, repeat: 0 });

        this.anims.create({ key: 'zBig_right', frames: this.anims.generateFrameNumbers('zombie_big_right', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'zBig_left', frames: this.anims.generateFrameNumbers('zombie_big_left', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'zBig_down', frames: this.anims.generateFrameNumbers('zombie_big_down', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'zBig_up', frames: this.anims.generateFrameNumbers('zombie_big_up', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });

        this.anims.create({ key: 'zBig_att_right', frames: this.anims.generateFrameNumbers('zombie_big_att_right', { start: 0, end: 14 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'zBig_att_left', frames: this.anims.generateFrameNumbers('zombie_big_att_left', { start: 0, end: 14 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'zBig_att_down', frames: this.anims.generateFrameNumbers('zombie_big_att_down', { start: 0, end: 14 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'zBig_att_up', frames: this.anims.generateFrameNumbers('zombie_big_att_up', { start: 0, end: 14 }), frameRate: 6, repeat: 0 });

        this.anims.create({ key: 'zBig_idle_right', frames: this.anims.generateFrameNumbers('zombie_big_idle_right', { start: 0, end: 5 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'zBig_idle_left', frames: this.anims.generateFrameNumbers('zombie_big_idle_left', { start: 0, end: 5 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'zBig_idle_down', frames: this.anims.generateFrameNumbers('zombie_big_idle_down', { start: 0, end: 5 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'zBig_idle_up', frames: this.anims.generateFrameNumbers('zombie_big_idle_up', { start: 0, end: 5 }), frameRate: 6, repeat: 0 });


        this.anims.create({ key: 'zAxe_death_right', frames: this.anims.generateFrameNumbers('zombie_axe_death_right', { start: 0, end: 6 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'zAxe_death_left', frames: this.anims.generateFrameNumbers('zombie_axe_death_left', { start: 0, end: 6 }), frameRate: 6, repeat: 0 });

        this.anims.create({ key: 'zAxe_right', frames: this.anims.generateFrameNumbers('zombie_axe_right', { start: 0, end: 7 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'zAxe_left', frames: this.anims.generateFrameNumbers('zombie_axe_left', { start: 0, end: 7 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'zAxe_down', frames: this.anims.generateFrameNumbers('zombie_axe_down', { start: 0, end: 7 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'zAxe_up', frames: this.anims.generateFrameNumbers('zombie_axe_up', { start: 0, end: 7 }), frameRate: 6, repeat: -1 });

        this.anims.create({ key: 'zAxe_att_right', frames: this.anims.generateFrameNumbers('zombie_axe_att_right', { start: 0, end: 6 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'zAxe_att_left', frames: this.anims.generateFrameNumbers('zombie_axe_att_left', { start: 0, end: 6 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'zAxe_att_down', frames: this.anims.generateFrameNumbers('zombie_axe_att_down', { start: 0, end: 6 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'zAxe_att_up', frames: this.anims.generateFrameNumbers('zombie_axe_att_up', { start: 0, end: 6 }), frameRate: 6, repeat: 0 });

        this.anims.create({ key: 'zAxe_idle_right', frames: this.anims.generateFrameNumbers('zombie_axe_idle_right', { start: 0, end: 5 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'zAxe_idle_left', frames: this.anims.generateFrameNumbers('zombie_axe_idle_left', { start: 0, end: 5 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'zAxe_idle_down', frames: this.anims.generateFrameNumbers('zombie_axe_idle_down', { start: 0, end: 5 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'zAxe_idle_up', frames: this.anims.generateFrameNumbers('zombie_axe_idle_up', { start: 0, end: 5 }), frameRate: 6, repeat: 0 });


        this.anims.create({ key: 'zSmall_death_right', frames: this.anims.generateFrameNumbers('zombie_small_death_right', { start: 0, end: 6 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'zSmall_death_left', frames: this.anims.generateFrameNumbers('zombie_small_death_left', { start: 0, end: 6 }), frameRate: 6, repeat: 0 });

        this.anims.create({ key: 'zSmall_right', frames: this.anims.generateFrameNumbers('zombie_small_right', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'zSmall_left', frames: this.anims.generateFrameNumbers('zombie_small_left', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'zSmall_down', frames: this.anims.generateFrameNumbers('zombie_small_down', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'zSmall_up', frames: this.anims.generateFrameNumbers('zombie_small_up', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });

        this.anims.create({ key: 'zSmall_att_right', frames: this.anims.generateFrameNumbers('zombie_small_att_right', { start: 0, end: 3 }), frameRate: 10, repeat: 0 });
        this.anims.create({ key: 'zSmall_att_left', frames: this.anims.generateFrameNumbers('zombie_small_att_left', { start: 0, end: 3 }), frameRate: 10, repeat: 0 });
        this.anims.create({ key: 'zSmall_att_down', frames: this.anims.generateFrameNumbers('zombie_small_att_down', { start: 0, end: 3 }), frameRate: 10, repeat: 0 });
        this.anims.create({ key: 'zSmall_att_up', frames: this.anims.generateFrameNumbers('zombie_small_att_up', { start: 0, end: 3 }), frameRate: 10, repeat: 0 });

        this.anims.create({ key: 'zSmall_idle_right', frames: this.anims.generateFrameNumbers('zombie_small_idle_right', { start: 0, end: 5 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'zSmall_idle_left', frames: this.anims.generateFrameNumbers('zombie_small_idle_left', { start: 0, end: 5 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'zSmall_idle_down', frames: this.anims.generateFrameNumbers('zombie_small_idle_down', { start: 0, end: 5 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'zSmall_idle_up', frames: this.anims.generateFrameNumbers('zombie_small_idle_up', { start: 0, end: 5 }), frameRate: 6, repeat: 0 });


        // Weapons
        this.anims.create({ key: 'bat_right_att', frames: this.anims.generateFrameNumbers('bat_right_attack', { start: 0, end: 3 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'bat_left_att', frames: this.anims.generateFrameNumbers('bat_left_attack', { start: 0, end: 3 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'bat_down_att', frames: this.anims.generateFrameNumbers('bat_down_attack', { start: 0, end: 3 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'bat_up_att', frames: this.anims.generateFrameNumbers('bat_up_attack', { start: 0, end: 3 }), frameRate: 6, repeat: 0 });

        this.anims.create({ key: 'bat_right_idle', frames: this.anims.generateFrameNumbers('bat_right_idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'bat_left_idle', frames: this.anims.generateFrameNumbers('bat_left_idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'bat_down_idle', frames: this.anims.generateFrameNumbers('bat_down_idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'bat_up_idle', frames: this.anims.generateFrameNumbers('bat_up_idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });


        this.anims.create({ key: 'gun_right_idle', frames: this.anims.generateFrameNumbers('gun_right_idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'gun_left_idle', frames: this.anims.generateFrameNumbers('gun_left_idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'gun_down_idle', frames: this.anims.generateFrameNumbers('gun_down_idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'gun_up_idle', frames: this.anims.generateFrameNumbers('gun_up_idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });

        this.anims.create({ key: 'gun_shoot_right', frames: this.anims.generateFrameNumbers('gun_shoot_right', { start: 0, end: 2 }), frameRate: 1, repeat: 0 });
        this.anims.create({ key: 'gun_shoot_left', frames: this.anims.generateFrameNumbers('gun_shoot_left', { start: 0, end: 2 }), frameRate: 1, repeat: 0 });
        this.anims.create({ key: 'gun_shoot_down', frames: this.anims.generateFrameNumbers('gun_shoot_down', { start: 0, end: 2 }), frameRate: 1, repeat: 0 });
        this.anims.create({ key: 'gun_shoot_up', frames: this.anims.generateFrameNumbers('gun_shoot_up', { start: 0, end: 2 }), frameRate: 1, repeat: 0 });

        this.anims.create({ key: 'shotgun_right_idle', frames: this.anims.generateFrameNumbers('shotgun_right_idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'shotgun_left_idle', frames: this.anims.generateFrameNumbers('shotgun_left_idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'shotgun_down_idle', frames: this.anims.generateFrameNumbers('shotgun_down_idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'shotgun_up_idle', frames: this.anims.generateFrameNumbers('shotgun_up_idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });

        this.anims.create({ key: 'shotgun_shoot_right', frames: this.anims.generateFrameNumbers('shotgun_shoot_right', { start: 0, end: 2 }), frameRate: 1, repeat: 0 });
        this.anims.create({ key: 'shotgun_shoot_left', frames: this.anims.generateFrameNumbers('shotgun_shoot_left', { start: 0, end: 2 }), frameRate: 1, repeat: 0 });
        this.anims.create({ key: 'shotgun_shoot_down', frames: this.anims.generateFrameNumbers('shotgun_shoot_down', { start: 0, end: 2 }), frameRate: 1, repeat: 0 });
        this.anims.create({ key: 'shotgun_shoot_up', frames: this.anims.generateFrameNumbers('shotgun_shoot_up', { start: 0, end: 2 }), frameRate: 1, repeat: 0 });



        // Fire
        this.anims.create({ key: 'fire_right', frames: this.anims.generateFrameNumbers('fire_right', { start: 0, end: 2 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'fire_left', frames: this.anims.generateFrameNumbers('fire_left', { start: 0, end: 2 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'fire_down', frames: this.anims.generateFrameNumbers('fire_down', { start: 0, end: 2 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'fire_up', frames: this.anims.generateFrameNumbers('fire_up', { start: 0, end: 2 }), frameRate: 6, repeat: -1 });

    }

    // Gemeinsame create-Logik für ALLE Levels
    setupLevel(map, startX, startY) {

        // Background color to replace background image from menu
        this.cameras.main.setBackgroundColor('#2d2d2d');

        // 1.
        const barrelData = map.filterObjects('interactions', obj => obj.name === 'barrel');

        this.chests = this.physics.add.staticGroup();

        // 2.
        barrelData.forEach(data => {
            const typeProp = data.properties?.find(p => p.name === 'type');
            const type = typeProp ? typeProp.value : 'barrel_blue';   // Fallback, falls Property fehlt

            // Textur schon beim Erstellen passend wählen
            //const textureKey = type === 'rare' ? 'barrel_gold' : 'barrel_wood';

            const chest = this.chests.create(data.x + data.width / 2, data.y + data.height / 2, 'barrel_' + type);
            chest.alpha = 0;

            console.log(type);
            chest.setData('opened', false);
            chest.setData('type', type);
        });


        // Items (Loot auf dem Boden)
        this.items = this.physics.add.staticGroup();

        // Items (Loot auf dem Boden)
        this.loot = this.physics.add.staticGroup();

        // SPIELER INSTANZIIEREN (Ersetzt die langen Physik-Blöcke)
        this.player = new Player(this, startX, startY);
        this.player.setDepth(-2);

        //Spieler in andere Szene übernehmen
        if (this.incomingPlayerdata) {
            Object.assign(this.player, this.incomingPlayerdata);

            /*const item = this.player.ownedItems[this.player.activeItemIndex];
            if (item) this.player.heldItem.setTexture(item.textureKey);
            else this.player.heldItem.setVisible(false);*/
        }


        // Falls UIScene schon läuft, stoppen und neu starten
        if (this.scene.isActive('UIScene')) {
            this.scene.stop('UIScene');
        }
        this.scene.launch('UIScene', { player: this.player });
        this.scene.bringToTop('UIScene');

        //this.physics.add.collider(this.player, this.obstaclesLayer);
        this.physics.add.collider(this.player, this.chests);

        // Kamera & Welt-Grenzen
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.cameras.main.startFollow(this.player, true, 1, 1);
        this.cameras.main.setRoundPixels(true);

        // Animationen erstellen
        this.createAnimations();

        // Sounds erstellen
        this.playBackground();

        // UI & HUD
        this.createDeathText();
        this.createWinText();

        // Projektile
        this.bullets = this.physics.add.group();
        this.physics.add.collider(this.bullets, this.obstaclesLayer, this.destroyBullet, null, this);

        // Portals
        const portalObjects = map.filterObjects('interactions', obj => obj.name === 'portal');

        this.portals = this.physics.add.staticGroup();

        portalObjects.forEach(p => {
            const zone = this.add.zone(p.x + p.width / 2, p.y + p.height / 2, p.width, p.height);
            this.physics.add.existing(zone, true);

            zone.setData('target', p.properties?.find(prop => prop.name === 'target')?.value);

            this.portals.add(zone);
        });

        this.physics.add.overlap(
            this.player,
            this.portals,
            this.enterPortal, // Callback: läuft bei Kollision
            null, // processCallback (optional, s.u.)
            this
        );


        // Zombies erstellen
        const zombieTypes = {
            // Mapping: Tiled-Name → Klasse

            zombieSmall: FastZombie,
            zombieBig: BigZombie,
            zombieAxe: AxeZombie
        };

        this.zombies = this.physics.add.group();

        const zombieObjects = map.filterObjects('interactions', obj => obj.name in zombieTypes);

        zombieObjects.forEach(zombieData => {
            const zClass = zombieTypes[zombieData.name];

            // Create a zombie of corresponding type
            let zombie = new zClass(this, zombieData.x, zombieData.y);

            this.zombies.add(zombie);
        });

        this.zombieHealthGraphics = this.add.graphics();
        this.zombieHealthGraphics.setDepth(10);

        // Zombie Collider
        this.physics.add.collider(this.zombies, this.zombies);

        this.physics.add.overlap(this.bullets, this.zombies, (bullet, zombie) => {
            zombie.takeDamage(bullet.getData('damage') ?? 34, bullet);
        }, null, this);

        // Create objects for collisions
        // Sicherheitscheck: Falls du das Layer in Tiled mal vergisst zu zeichnen
        if (this.collisionLayer && this.collisionLayer.objects) {

            // 3. Jedes einzelne gezeichnete Rechteck durchlaufen
            this.collisionLayer.objects.forEach(obj => {

                // Tiled platziert den Ursprung (Origin) bei Objekten manchmal anders.
                // Phaser braucht für statische Körper die Mitte, deshalb rechnen wir + width/2
                const x = obj.x + (obj.width / 2);
                const y = obj.y + (obj.height / 2);

                // Erstelle einen unsichtbaren, statischen Physik-Körper
                let wall = this.physics.add.staticSprite(x, y, null);

                // Setze die exakte Größe des Tiled-Rechtecks auf den Physik-Körper
                wall.body.setSize(obj.width, obj.height);

                // Macht das Hilfs-Sprite unsichtbar (wir wollen ja nur die unsichtbare Wand)
                wall.setVisible(false);

                // Füge die Wand unserer Gruppe hinzu
                this.collisionGroup.add(wall);
            });
        }

        // Radiation areas
        const radObjects = map.filterObjects('interactions', obj => obj.name === 'rad');

        this.radZones = this.physics.add.staticGroup();

        radObjects.forEach(obj => {
            // Mittelpunkt
            const cx = obj.x + obj.width / 2;
            const cy = obj.y + obj.height / 2;

            const zone = this.add.zone(cx, cy, obj.width, obj.height);
            this.physics.add.existing(zone, true);

            if (obj.ellipse) {
                // Kreis-Body: Radius = halbe Breite
                zone.body.setCircle(obj.width / 2);
            }
            // Rechteck: passt schon - Zone-size = Body-size

            this.radZones.add(zone);
        });

        // Radiation areas overlap
        this.physics.add.overlap(this.player, this.radZones, (player, zone) => {
            player.addRad(player.areaRadFactor);
        });

        // Obstacles colliders
        this.physics.add.collider(this.player, this.collisionGroup);
        this.physics.add.collider(this.zombies, this.collisionGroup);
        this.physics.add.collider(this.bullets, this.collisionGroup, (bullet) => {
            bullet.destroy(); // Zerstört die Kugel bei Wandtreffer
        });


        // Post Update für die Waffe
        this.events.on('postupdate', () => {
            this.player.updateItemPosition();
        });
    }

    defaultUpdate() {
        // Spiel-Neustart bei Tod
        if (this.player.isDead) {
            if (Phaser.Input.Keyboard.JustDown(this.player.interactKey)) {
                this.scene.start('MainScene',{ playerData: null });
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

    enterPortal(player, portal) {
        // Parameter kommen in der Reihenfolge A, B – wie beim Overlap
        console.log('Portal berührt:', portal.name);

        if (this.isTransitioning) return;
        this.isTransitioning = true;

        const target = portal.getData('target');
        this.scene.start(target, {
            playerData: {
                health: this.player.health,
                radiation: this.player.radiation,
                ownedItems: this.player.ownedItems,
                activeItemIndex: this.player.activeItemIndex
            }
        });
    }

    createDeathText() {
        this.gameOverText = this.add.text(220, 120, 'GAME OVER\nPress E to Restart', { fontSize: '96px', fill: '#ff0000', fontFamily: 'CustomFont', align: 'center', fontStyle: 'bold' });
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.setScale(0.25);
        this.gameOverText.setScrollFactor(0);
        this.gameOverText.setDepth(100);
        this.gameOverText.setVisible(false);
    }

    createWinText() {
        this.winText = this.add.text(220, 120, 'YOU RESCUED\nyour daughter!\n\nPress E to Play Again', { fontSize: '96px', fill: '#4cd324', fontFamily: 'CustomFont', align: 'center', fontStyle: 'bold' });
        this.winText.setOrigin(0.5);
        this.winText.setScale(0.25);
        this.winText.setScrollFactor(0);
        this.winText.setDepth(100);
        this.winText.setVisible(false);
    }

    updateZombies() {
        this.zombies.children.iterate((zombie) => {
            if (!zombie || !zombie.active || zombie.isDead) return;

            zombie.chasePlayer(this.player, zombie.chaseDist);
        });
    }

    drawZombiesHealthBars() {
        this.zombieHealthGraphics.clear();

        if (this.player.isDead) return;

        this.zombies.children.iterate((zombie) => {
            if (zombie && zombie.active) {
                zombie.drawHealthBar(this.zombieHealthGraphics);
            }
        });
    }

    handlePlayerDeath() {
        this.zombies.children.iterate((zombie) => {
            if (zombie && zombie.body) zombie.body.setVelocity(0);
        });

        this.zombieHealthGraphics.clear();

        this.gameOverText.setVisible(true);

        this.sound.stopAll();
        this.sound.add('bgLost', { loop: true, volume: 1 }).play();

        // Automatically restart after 10 seconds
        /*this.time.delayedCall(10000, () => {
            this.scene.restart();
        });*/
    }

    //
    dropIod(x, y) {
        const iodine = this.loot.create(x, y, 'iod');

        iodine.setData('type', 'iod');
        iodine.setData('radiation', Phaser.Math.Between(1, 6));

        return iodine;
    }

    dropMedkit(x, y) {
        const medkit = this.loot.create(x, y, 'medkit');

        medkit.setData('type', 'medkit');
        medkit.setData('heal', Phaser.Math.Between(5, 20));

        return medkit;
    }

    // Only for weapons
    spawnItem(x, y, isLoot, weaponName) {
        // If method is called to spawn new item as a loot
        if (isLoot) {
            const weaponData = new Item(weaponName, weaponName, 34, 200);

            let groundWeapon = new GroundItem(this, x, y, weaponData);

            this.items.add(groundWeapon);

        // If method is called to leave currentItem on the ground
        } else {
            const itemToDrop = this.player.ownedItems[this.player.activeItemIndex];

            let newGroundItem = new GroundItem(this, x, y, itemToDrop);

            this.items.add(newGroundItem);
        }
    }

    pickupWeapon(groundItem) {
        let pl = this.player;

        if (pl.ownedItems[pl.activeItemIndex] != null) {
            this.spawnItem(pl.x, pl.y, false);
        }

        // Put new item to the player inventory
        pl.ownedItems[pl.activeItemIndex] = groundItem.itemData;

        // Update heldItem texture
        pl.heldItem.setTexture(pl.ownedItems[pl.activeItemIndex].textureKey);
        pl.heldItem.setVisible(true);

        groundItem.destroy();
    }

    pickupLoot(loot) {
        if (loot.getData('type') === 'iod') {
            const radiHeal = loot.getData('radiation');

            this.player.addRad(-radiHeal);

            loot.destroy();
        }

        if (loot.getData('type') === 'medkit') {
            const heal = loot.getData('heal');

            this.player.addHealth(heal);

            loot.destroy();
        }

    }

    // ----- GAMEPLAY FUNKTIONEN -----

    destroyBullet(bullet) {
        bullet.destroy();
    }

    checkPickableNearby() {
        const maxPickupDist = 5;
        this.loot.children.iterate((loot) => {
            if (!loot || !loot.active) return;

            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, loot.x, loot.y);
            if (dist < maxPickupDist) {
                this.pickupLoot(loot);
            }
        });
    }

    checkItemInteraction() {
        const maxPickupDist = 35;
        this.items.children.iterate((item) => {
            if (!item || !item.active) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y);
            if (dist < maxPickupDist) {
                this.pickupWeapon(item);
            }
        });
    }


    checkChestInteraction() {
        const maxDist = 20;

        this.chests.children.iterate((chest) => {
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, chest.x, chest.y);
            if (dist < maxDist && !chest.getData('opened')) {
                this.openChest(chest);
            }
        });
    }

    rollChestLoot() {
        const roll = Phaser.Math.Between(1, 100);
        let cumulative = 0;

        for (const [key, chance] of Object.entries(this.chestLootChances)) {
            cumulative += chance;
            if (roll <= cumulative) return key;
        }
        return null;
    }

    openChest(chest) {
        if (chest.getData('opened')) return;

        chest.setData('opened', true);

        this.chestLootChances = {
            bat: 5,
            gun: 5,
            shotgun: 40,
            medkit: 25,
            iod: 25,
            nothing: 0   // bewusste "leere Kiste"-Chance
        };

        const chestType = chest.getData('type');   // s.u. – oft schon da!
        //console.log(chestType);

        this.sound.play('barrel', { volume: 2 });
        chest.alpha = 1;
        chest.setDepth(5);

        const result = this.rollChestLoot();

        const lootActions = {
            bat:     () => this.spawnItem(chest.x, chest.y, true, 'bat'),
            gun:     () => this.spawnItem(chest.x, chest.y, true, 'gun'),
            shotgun: () => this.spawnItem(chest.x, chest.y, true, 'shotgun'),
            medkit:  () => this.dropMedkit(this.player.x, this.player.y),
            iod:     () => this.dropIod(this.player.x, this.player.y),
            nothing: () => {}   // absichtlich nichts
        };

        if (result) lootActions[result]();


    }


}