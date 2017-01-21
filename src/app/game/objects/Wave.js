export default class Wave extends Phaser.Sprite {

  constructor(game, x, y) {
    super(game, x, y, 'sprite_wave', 5);

    //  Enable Arcade Physics for the sprite
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    this.moveSpeed = 0.8;
    this.isMovingTowardLand = true;
    this.moveTimer = 0.0;
    this.totalMovingTime = 1800;
  }

  update() {
    if (this.isMovingTowardLand) {
      this.x += this.moveSpeed;
    } else {
      this.x -= this.moveSpeed;
    }

    if (this.moveTimer >= this.totalMovingTime) {
      this.isMovingTowardLand = !this.isMovingTowardLand;
      this.moveTimer = 0;
    }
    this.moveTimer += this.game.time.elapsed;
  }

  render() {
  }

}
