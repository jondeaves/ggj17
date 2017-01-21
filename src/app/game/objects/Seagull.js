import { turnToFace, toDegrees } from '../helpers';

export default class Seagull extends Phaser.Sprite {

  constructor(game, x, y, hordeControllers) {
    super(game, x, y, 'sprite_seagull', 5);

    //  Enable Arcade Physics for the sprite
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    //  Tell it we don't want physics to manage the rotation
    this.rotation = this.game.physics.arcade.angleBetween(this, {
      x: this.game.width / 2,
      y: this.game.height / 2,
    });

    // Do we have anything we want to move towards?
    this.target = null;
    this.hordeControllers = hordeControllers;

    this.lostTargetTimer = 0;

    this.canAttack = true;
  }

  setLastCollision(time) {
    this.lastCollision = time;
  }

  changeTarget(target) {
    this.target = target;
  }

  update() {
    if ((this.game.totalTimeActive - this.lastCollision) < 10) {
      this.canAttack = false;
    } else {
      this.canAttack = true;
    }


    if (this.lostTargetTimer > 0) {
      this.lostTargetTimer -= this.game.time.elapsed;
    }

    if (this.target === null) {
      this.game.physics.arcade.velocityFromAngle(this.angle, 180, this.body.velocity);

      // Without a target search for one
      if (
        this.lostTargetTimer <= 0 &&
        typeof this.hordeControllers !== 'undefined' &&
        this.hordeControllers.length > 0 &&
        this.game.physics.arcade.distanceBetween(this, this.hordeControllers.getChildAt(0)) <= 350
      ) {
        this.lostTargetTimer = 0;
        this.changeTarget(this.hordeControllers.getChildAt(0));
      }
    } else if (this.target !== null) {
      this.rotation = this.game.physics.arcade.moveToObject(this, this.target, 240);

      // Lose target if too close, stopped rapid spinning
      if (this.game.physics.arcade.distanceBetween(this, this.target) <= 20) {
        this.lostTargetTimer = 3000.0;
        this.changeTarget(null);
      }
    } else {
      this.game.physics.arcade.velocityFromAngle(this.angle, 180, this.body.velocity);
    }
  }

  updateHordeControllers(hordeControllers) {
    this.hordeControllers = hordeControllers;
  }

  checkAttackChance() {
    return Math.random() < 0.5 ? true : false;
  }
}
