export default class QueenCrab extends Phaser.Sprite {

  constructor(game, x, y) {
    super(game, x, y, 'sprite_queen', 5);

    //  Enable Arcade Physics for the sprite
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    // Setup animation
    this.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
    this.play('move');

    this.health = 8;
  }
}
