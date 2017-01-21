export default class GameOverState extends Phaser.State {
  create() {
    // Just to get us started
    this.stage.backgroundColor = '#182d3b';
    this.stateBg = this.add.image(0, 0, 'bg_gameover_screen');
    this.stateBg.width = this.game.width;
    this.stateBg.height = this.game.height;

    // Audio
    this.deadSfx = this.game.add.audio('state_dead_music');
    this.deadSfx.play();
    this.deadSfx.onStop.add(() => {
      this.game.state.start('SplashState', true, false);
    }, this);
  }
}
