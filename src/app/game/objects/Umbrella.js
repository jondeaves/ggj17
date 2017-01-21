export default class Umbrella extends Phaser.Sprite {

  constructor(game, x, y) {
    super(game, x, y, 'sprite_umbrella', 5);

    this.lastCollision = 0;
  }

  setLastCollision(time) {
    this.lastCollision = time;
  }

  update() {
    if ((this.game.totalTimeActive - this.lastCollision) < 50) {
      this.alpha = 0.3;
    } else {
      this.alpha = 1;
    }
  }
}
