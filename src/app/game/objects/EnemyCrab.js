export default class EnemyCrab extends Phaser.Sprite {

  constructor(game, x, y) {
    super(game, x, y, 'sprite_crab_enemy', 5);

    //  Enable Arcade Physics for the sprite
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.scale.setTo(0.6, 0.6);

    // Setup animation
    this.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
    this.play('move');


    // Attack state
    this.isDead = false;
    this.modifiers = {
      health: 4,
    };
    this.resetAttack();
  }

  update() {
    this.checkDeath();

    if (this.attackTarget !== null) {
      if (this.attackTimer >= this.attackRate) {
        this.attackTarget.attacked(this.attackStrength);
        this.attackTimer = 0;
      }

      this.attackTimer += this.game.time.elapsed;
    } else {
      this.resetAttack();
    }
  }

  checkDeath() {
    if (this.modifiers.health > 0) {
      return false;
    }

    this.isDead = true;
    return true;
  }

  resetAttack() {
    this.attackTimer = 0;
    this.attackRate = 3000;
    this.attackStrength = 2;
    this.attackTarget = null;
  }

  attacked(damage = 1) {
    this.modifiers.health -= damage;
    console.log(`Crab attacked: ${this.modifiers.health}`);
  }
}
