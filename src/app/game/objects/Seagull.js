import { turnToFace, toDegrees, toRadians } from '../helpers';

export default class Seagull extends Phaser.Sprite {

  constructor(game, x, y, hordeControllers) {
    super(game, x, y, 'sprite_seagull', 5);

    //  Enable Arcade Physics for the sprite
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.animations.add('move', [0, 1, 2, 3], 4, true);
    this.animations.play('move');
    this.scale.setTo(0.4, 0.4);

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

    this.targetLockedSfx = this.game.add.audio('SFX_mine');
  }

  setLastCollision(time) {
    this.lastCollision = time;
  }

  changeTarget(target) {
    this.target = target;
  }

  stopSfx() {
    this.targetLockedSfx.stop();
  }

  update() {
    if ((this.game.totalTimeActive - this.lastCollision) < 10) {
      this.canAttack = false;
    } else {
      this.canAttack = true;
    }

    const distanceRequired = 1600;

    if (this.target !== null) {
      let targetDistance = this.game.physics.arcade.distanceBetween(this, this.target);
      if (targetDistance <= distanceRequired) {
        if (this.targetLockedSfx.isPlaying === false) {
          this.targetLockedSfx.loopFull(1);
        }
      } else {
        this.targetLockedSfx.stop();
      }
    } else {
      this.targetLockedSfx.stop();
    }


    if (this.lostTargetTimer > 0) {
      this.lostTargetTimer -= this.game.time.elapsed;
    }

    if (this.target === null && this.x > 4600) {
      this.game.physics.arcade.velocityFromAngle(this.angle, 180, this.body.velocity);

      // Without a target search for one
      if (
        this.lostTargetTimer <= 0 &&
        typeof this.hordeControllers !== 'undefined' &&
        this.hordeControllers.length > 0 &&
        this.game.physics.arcade.distanceBetween(this, this.hordeControllers.getChildAt(0)) <= distanceRequired
      ) {
        this.lostTargetTimer = 0;
        this.changeTarget(this.hordeControllers.getChildAt(0));
      }
    } else if (this.target !== null) {
      this.rotation = this.game.physics.arcade.moveToObject(this, this.target, 240) ;

      // Lose target if too close, stopped rapid spinning
      if (this.game.physics.arcade.distanceBetween(this, this.target) <= 20) {
        this.lostTargetTimer = 3000.0;
        this.changeTarget(null);
      }
    } else {
      this.game.physics.arcade.velocityFromAngle(this.angle, 180, this.body.velocity);
      this.target = null;
    }
  }

  updateHordeControllers(hordeControllers) {
    this.hordeControllers = hordeControllers;
  }
}
