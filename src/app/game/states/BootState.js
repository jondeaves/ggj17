/* global Fabrique */
export default class BootState extends Phaser.State {

  create() {
    // For multi touch devices, this is how many touches can be triggered at once
    this.game.input.maxPointers = 2;

    // Scale the game on smaller devices
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    this.game.scale.maxWidth = this.game.constants.world.width;
    this.game.scale.maxHeight = this.game.constants.world.height;
    this.game.scale.forceLandscape = true;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.refresh();

    // Move Along
    this.game.state.start('LoadingState', true, false);
  }

}
