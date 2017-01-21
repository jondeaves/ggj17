export default class MenuState extends Phaser.State {
  create() {
    // Just to get us started
    this.stage.backgroundColor = '#182d3b';

    this.stateBg = this.add.image(0, 0, 'bg_victory_screen');
    this.stateBg.width = this.game.width;
    this.stateBg.height = this.game.height;

    this.stateOverlay = this.add.image(0, 0, 'overlay_victory_screen');
    this.stateOverlay.width = this.game.width;
    this.stateOverlay.height = this.game.height;
  }
}
