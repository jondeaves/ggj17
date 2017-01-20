import BootState from './states/BootState';
import LoadingState from './states/LoadingState';
import GamePlayState from './states/GamePlayState';

import Constants from './constants';

export default class Game extends Phaser.Game {

  constructor() {
    super(Constants.world.width, Constants.world.height, Phaser.CANVAS, 'game_canvas', null);

    this.state.add('BootState', BootState, false);
    this.state.add('LoadingState', LoadingState);
    this.state.add('GamePlayState', GamePlayState);

    this.state.start('BootState', true, false);

    this.constants = Constants;
  }

}
