export default class Ground extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, itemData) {
        super(scene, x, y, itemData.textureKey);

        scene.add.existing(this);
        scene.physics.add.existing(this, true);

        this.itemData = itemData;
    }
}