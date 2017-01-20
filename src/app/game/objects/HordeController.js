export default class HordeController extends Phaser.Sprite {

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
    this.wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

    // Gamepad
    this.game.input.gamepad.start();
    this.gamePad = this.game.input.gamepad.pad1;
  }

  update() {
    this.updateInput();
  }

  updateInput() {

    // Ensure input is captured only when within game window
    if (this.game.input.activePointer.withinGame) {
      this.game.input.enabled = true;
    } else {
      this.game.input.enabled = false;
    }

    // Movement
    if (this.moveUp()) {
      this.y -= this.moveSpeed;
    } else if (this.moveDown()) {
      this.y += this.moveSpeed;
    }

    if (this.moveLeft()) {
      this.x -= this.moveSpeed;
    } else if (this.moveRight()) {
      this.x += this.moveSpeed;
    }
  }


  moveUp() {
    return (
      this.gamePad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) ||
      this.gamePad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1 ||
      this.wKey.isDown === true ||
      this.cursors.up.isDown
    );
  }

  moveRight() {
    return (
      this.gamePad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) ||
      this.gamePad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1 ||
      this.dKey.isDown === true ||
      this.cursors.right.isDown
    );
  }

  moveDown() {
    return (
      this.gamePad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) ||
      this.gamePad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1 ||
      this.sKey.isDown === true ||
      this.cursors.down.isDown
    );
  }

  moveLeft() {
    return (
      this.gamePad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) ||
      this.gamePad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1 ||
      this.aKey.isDown === true ||
      this.cursors.left.isDown
    );
  }

}
