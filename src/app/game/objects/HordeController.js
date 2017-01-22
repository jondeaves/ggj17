import { getRandomInt, getRandomArbitrary } from '../helpers';
import HordeMember from '../objects/HordeMember';

export default class HordeController extends Phaser.Sprite {

  constructor(game) {
    const startX = 4200;
    const startY = 877;

    super(game, startX, startY, 'sprite_hermy', 5);

    // Phaser data
    this.startX = startX;
    this.startY = startY;
    this.scale.setTo(0.4, 0.4);
    this.game = game;
    this.anchor.setTo(0.5);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.setSize(30, 30, 46, 46);

    this.isDead = false;

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
      health: 2,
    };
    this.targetLocked = false;
    this.targetLockedPreviousPos = { x: 0, y: 0 };

    this.resetAttack();
    this.killCount = 0;
  }

  getHealth() {
    return this.modifiers.health + this.members.length;
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
    let hasRemoved = false;

    for (iHorde; iHorde < count; iHorde += 1) {
      if (this.members.length > 0) {
        hasRemoved = true;
        const removedMember = this.members.getRandom();
        this.members.remove(removedMember, true);
        removedMember.destroy();
      }
    }

    return hasRemoved;
  }

  applyPickup(pickup) {
    if (pickup.attributes.ident == 'shelly') {
      this.addToHorde(pickup.attributes.value);
    } else {
      if (Object.prototype.hasOwnProperty.call(this.modifiers, pickup.attributes.modifier)) {
        this.modifiers[pickup.attributes.modifier] += pickup.attributes.value;
      }

      // Kill the pickup after the time
      setTimeout(() => this.destroyPickup(pickup), pickup.attributes.duration);
    }
  }

  destroyPickup(pickup) {
    if (Object.prototype.hasOwnProperty.call(this.modifiers, pickup.attributes.modifier)) {
      this.modifiers[pickup.attributes.modifier] -= pickup.attributes.value;
    }
  }

  update() {
    this.updateInput();
    this.updateHorde();
    this.updateAttack();

    if (!this.isDead) {
      this.checkDeath();
    }
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

  checkDeath() {
    if (this.modifiers.health > 0) {
      return false;
    }

    this.isDead = true;
    return true;
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

  attacked(damage = 1) {
    const attackSuccess = Math.random() < 0.5;
    if (attackSuccess === false) {
      return;
    }

    const removeState = this.removeFromHorde(1);
    if (removeState === false) {
      // if false, assume we have no members left
      // and have been directly attacked.
      this.modifiers.health -= damage;
    }
  }

  updateAttack() {
    if (this.attackTarget !== null && this.attackTarget.isDead) {
      this.killCount += 1;
      console.log('adding more shells');
      this.addToHorde(3);
      this.attackTarget = null;
    }

    if (this.attackTarget !== null) {
      if (this.attackTimer >= this.attackRate) {
        this.attackTarget.attacked(this.attackStrength + (this.members.length));
        this.attackTimer = 0;
      }

      this.attackTimer += this.game.time.elapsed;
    } else {
      this.resetAttack();
    }
  }

  resetAttack() {
    this.attackTimer = 0;
    this.attackRate = 3000;
    this.attackStrength = 1;
    this.attackTarget = null;
  }

  queenFail() {
    const crabsLost = getRandomInt(0, this.members.length - 1);
    this.removeFromHorde(crabsLost);

    this.x = this.startX;
    this.y = this.startY;
  }
}
