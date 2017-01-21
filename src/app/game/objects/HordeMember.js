import { toRadians } from '../helpers';

export default class HordeController extends Phaser.Sprite {

  constructor(game, asset, hordeController) {
    super(game, hordeController.x, hordeController.y, asset, 5);

    //  Enable Arcade Physics for the sprite
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    // Phaser data
    this.game = game;
    this.anchor.setTo(0.5);
    this.moveSpeed = 5;

    this.hordeController = hordeController;

    // Setup animation
    this.animations.add('left', [0, 1, 2, 3, 4], 10, true);
    this.animations.add('right', [5, 6, 7, 8, 9], 10, true);
    this.play('right');
  }

  update() {
    this.x = this.hordeController.x + (this.radius * Math.cos(toRadians(this.angle)));
    this.y = this.hordeController.y + (this.radius * Math.sin(toRadians(this.angle)));
  }

  setMovementInfo(radius, angle) {
    this.radius = radius;
    this.angle = angle;
  }
}
