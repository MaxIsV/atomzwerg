export default class Item {
    constructor(name, textureKey, damage, cooldown) {
        this.name = name;
        this.textureKey = textureKey;

        this.damage = damage
        this.cooldown = cooldown;
    }
}