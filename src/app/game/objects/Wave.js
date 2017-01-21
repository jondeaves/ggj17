export default class Wave extends Phaser.Sprite {

  constructor(game, x, y) {
    super(game, x, y, 'sprite_wave', 5);

    //  Enable Arcade Physics for the sprite
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    // Setup animation
    this.animationRef = null;
    this.animations.add('move');
    this.animations.frame = 0;

    this.moveDistance = 0;
    this.moveTime = 3000;
    this.moveTimer = 0;
    this.moveSpeed = 1.2;
    this.isResetting = false;
    this.resetTimeout = null;

    this.menuWaveSfx = this.game.add.audio('SFX_wave_triggered');
  }

  update() {
    if (this.isResetting) {
      if (this.animationRef !== null && this.animationRef.isFinished && this.resetTimeout === null) {
        this.resetTimeout = setTimeout(() => {
          this.x -= this.moveDistance;
          this.moveDistance = 0;
          this.moveTimer = 0;
          this.isResetting = false;
          this.animations.frame = 0;

          this.animationRef = null;
          this.resetTimeout = null;

          this.menuWaveSfx.volume = 0.1;
          this.menuWaveSfx.play();
        }, 5000);
      }
      return;
    }


    // If not resetting then do some moving
    this.x += this.moveSpeed;
    this.moveDistance += this.moveSpeed;

    if (this.moveTimer >= this.moveTime) {
      this.isResetting = true;
      this.animationRef = this.animations.play('move', 10, false);
    }
    this.moveTimer += this.game.time.elapsed;
  }

  render() {
  }

}
