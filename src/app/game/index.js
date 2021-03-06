import BootState from './states/BootState';
import LoadingState from './states/LoadingState';
import SplashState from './states/SplashState';
import InstructionState from './states/InstructionState';
import MenuState from './states/MenuState';
import GamePlayState from './states/GamePlayState';
import GameOverState from './states/GameOverState';
import VictoryState from './states/VictoryState';

import Constants from './constants';

export default class Game extends Phaser.Game {

  constructor() {
    super(Constants.world.resolution.width, Constants.world.resolution.height, Phaser.CANVAS, 'game_canvas', null);

    this.constants = Constants;
    this.IsDebug = (this.getParameterByName('debug') === '1');

    this.state.add('BootState', BootState, false);
    this.state.add('LoadingState', LoadingState);
    this.state.add('SplashState', SplashState);
    this.state.add('MenuState', MenuState);
    this.state.add('InstructionState', InstructionState);
    this.state.add('GamePlayState', GamePlayState);
    this.state.add('GameOverState', GameOverState);
    this.state.add('VictoryState', VictoryState);

    this.state.start('BootState', true, false);
  }

  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

}
