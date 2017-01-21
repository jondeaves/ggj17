export default class Pickup extends Phaser.Sprite {

  /**
   * TTL is number of milliseconds the pickup lives for
   * Movespeed should be set only if this pickup affects movespeed
   */
  constructor(game, x, y, attr) {
    super(game, x, y, attr.asset, 5);
    this.attributes = attr;

    //  Enable Arcade Physics for the sprite
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
  }

}
