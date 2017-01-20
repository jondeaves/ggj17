import _ from 'lodash';
import Player from '../objects/Player';

export default class GamePlayState extends Phaser.State {
  create() {
    this.stateBg = this.add.image(0, 0, 'bg_gameplay_screen');
    this.stateBg.width = this.game.width;
    this.stateBg.height = this.game.height;

    // Generate the world as it begins
    this.generateWorld();
  }

  generateWorld() {
    this.players = this.add.group();
    this.players.add(new Player(this.game, 50, 50, 'sprite_player'));
  }

  update() {
    this.updateTimer();

    // Updates related to player
    this.players.forEach((player) => {
      // Updates on the player object
      player.update();
    });
  }

  updateTimer() {
    if (typeof this.totalTimeActive === 'undefined') {
      this.totalTimeActive = 0;
    }
    this.totalTimeActive += this.time.elapsed;
  }

}
