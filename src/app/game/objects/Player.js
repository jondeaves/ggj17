export default class Player extends Phaser.Sprite {

  constructor(game, x, y, asset) {
    super(game, x, y, asset, 5);

    // Phaser data
    this.game = game;
    this.anchor.setTo(0.5);
    this.moveSpeed = 5;

    // Setup animation
    this.animations.add('left', [0, 1, 2, 3, 4], 10, true);
    this.animations.add('right', [5, 6, 7, 8, 9], 10, true);
    this.play('right');

    // Add input keys
    this.cursors = this.game.input.keyboard.createCursorKeys();
  }

  update() {
    this.updateInput();
  }

  updateInput() {
    if (this.cursors.left.isDown) {
      this.x -= this.moveSpeed;
    } else if (this.cursors.right.isDown) {
      this.x += this.moveSpeed;
    }

    if (this.cursors.up.isDown) {
      this.y -= this.moveSpeed;
    } else if (this.cursors.down.isDown) {
      this.y += this.moveSpeed;
    }
  }
}
