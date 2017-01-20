export default class SplashState extends Phaser.State {

  init(sessionManager) {
    this.sessionManager = sessionManager;
  }

  create() {
    // Just to get us started
    this.stage.backgroundColor = '#182d3b';
    this.stateBg = this.add.image(0, 0, 'bg_splash_screen');
    this.stateBg.width = this.game.width;
    this.stateBg.height = this.game.height;
  }

  update() {
    this.updateTimer();

    if (this.totalTimeActive > 3000) {
      this.splashComplete();
    }
  }

  updateTimer() {
    if (typeof this.totalTimeActive === 'undefined') {
      this.totalTimeActive = 0;
    }
    this.totalTimeActive += this.time.elapsed;
  }

  splashComplete() {
    this.state.start('GamePlayState', true, false);
  }
}
