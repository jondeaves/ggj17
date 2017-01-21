import { getRandomArbitrary } from '../helpers';
import HordeMember from '../objects/HordeMember';

export default class HordeController extends Phaser.Sprite {

  constructor(game, x, y, asset) {
    super(game, x, y, asset, 5);

    // Phaser data
    this.scale.setTo(0.4, 0.4);
    this.game = game;
    this.anchor.setTo(0.5);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.setSize(30, 30, 46, 46);

    // Setup animation
    this.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);

    // Setup members of horde
    this.members = this.game.add.physicsGroup();

    // Add input keys
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

    // Gamepad
    this.game.input.gamepad.start();
    this.gamePad = this.game.input.gamepad.pad1;

    // Setup movement of hordes
    this.movementTimer = 0.0;
    this.timeBetweenMovements = 160.0;

    // Modifiers, pickups
    this.modifiers = {
      moveSpeed: 5,
    };
    this.targetLocked = false;
    this.targetLockedPreviousPos = { x: 0, y: 0 };
  }

  addToHorde(count) {
    let iHorde = 0;

    for (iHorde; iHorde < count; iHorde += 1) {
      this.members.add(new HordeMember(
        this.game,
        'sprite_wiggle',
        this,
        0.1,
      ));
    }
  }

  removeFromHorde(count) {
    let iHorde = 0;

    for (iHorde; iHorde < count; iHorde += 1) {
      if (this.members.length > 0) {
        this.members.remove(this.members.getRandom(), true, false);
      }
    }
  }

  applyPickup(pickup) {
    if (Object.prototype.hasOwnProperty.call(this.modifiers, pickup.attributes.modifier)) {
      this.modifiers[pickup.attributes.modifier] += pickup.attributes.value;
    }

    // Kill the pickup after the time
    setTimeout(() => this.destroyPickup(pickup), pickup.attributes.duration);
  }

  destroyPickup(pickup) {
    if (Object.prototype.hasOwnProperty.call(this.modifiers, pickup.attributes.modifier)) {
      this.modifiers[pickup.attributes.modifier] -= pickup.attributes.value;
    }
  }

  update() {
    this.updateInput();
    this.updateHorde();
  }

  updateHorde() {
    let angle = 0;
    const radius = 100;

    if (this.movementTimer >= this.timeBetweenMovements) {
      this.members.forEach((member) => {
        // const iRadius = radius + getRandomArbitrary(-20, 20);
        const iRadius = radius;

        // Move player to new position
        member.setMovementInfo(iRadius, angle);

        // Increment angle by random amount
        const baseAngleIncrease = 360 / this.members.length;
        // angle += baseAngleIncrease + getRandomArbitrary(5, 20);
        angle += baseAngleIncrease;
      });

      this.movementTimer = 0.0;
    }

    this.movementTimer += this.game.time.elapsed;
  }

  updateInput() {
    let hasMoved = false;

    if (this.targetLocked !== false) {
      if (this.targetLocked.x !== this.targetLockedPreviousPos.x) {
        this.x += this.targetLocked.moveSpeed;
      }

      this.targetLockedPreviousPos = { x: this.targetLocked.x, y: this.targetLocked.y };
      return;
    }


    // Movement
    if (this.moveUp()) {
      hasMoved = true;
      this.y -= this.modifiers.moveSpeed;
    } else if (this.moveDown()) {
      hasMoved = true;
      this.y += this.modifiers.moveSpeed;
    }

    if (this.moveLeft()) {
      hasMoved = true;
      this.x -= this.modifiers.moveSpeed;
    } else if (this.moveRight()) {
      hasMoved = true;
      this.x += this.modifiers.moveSpeed;
    }

    if (hasMoved) {
      this.animations.play('move');
    } else {
      this.animations.stop('move');
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

  attacked() {
    this.removeFromHorde(1);
    console.log('you are attacked, sir!');
  }
}
