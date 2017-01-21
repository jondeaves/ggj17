export default class EnemyCrab extends Phaser.Sprite {

  constructor(game, x, y) {
    super(game, x, y, 'sprite_crab_enemy', 5);

    //  Enable Arcade Physics for the sprite
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    // Setup animation
    this.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    this.play('move');
  }
}