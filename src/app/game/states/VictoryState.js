export default class MenuState extends Phaser.State {
  create() {
    // Just to get us started
    this.stage.backgroundColor = '#182d3b';

    this.stateBg = this.add.image(0, 0, 'bg_victory_screen');
    this.stateBg.width = this.game.width;
    this.stateBg.height = this.game.height;

    setTimeout(() => {
      this.victorySfx = this.game.add.audio('state_victory_music');
      this.victorySfx.play();
      this.victorySfx.onStop.add(() => {
        this.game.state.start('SplashState', true, false);
      }, this);
    }, 300);
  }
}
