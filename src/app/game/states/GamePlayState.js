import _ from 'lodash';
import HordeController from '../objects/HordeController';

export default class GamePlayState extends Phaser.State {
  create() {
    this.stateBg = this.add.image(0, 0, 'bg_gameplay_screen');
    this.stateBg.width = this.game.width;
    this.stateBg.height = this.game.height;

    // Generate the world as it begins
    this.generateWorld();
  }

  generateWorld() {
    this.hordeControllers = this.add.group();
    this.hordeController = new HordeController(this.game, 50, 50, 'sprite_player');
    this.hordeControllers.add(this.hordeController);


    this.game.world.setBounds(null);
    this.game.camera.follow(this.hordeController);
  }

  render() {
    this.game.debug.cameraInfo(this.game.camera, 32, 32);
    this.game.debug.spriteCoords(this.hordeController, 32, 500);
  }

  update() {
    this.updateTimer();

    // Updates related to hordes
    this.hordeControllers.forEach((hordeController) => {
      // Updates on the horde object
      hordeController.update();
    });
  }

  updateTimer() {
    if (typeof this.totalTimeActive === 'undefined') {
      this.totalTimeActive = 0;
    }
    this.totalTimeActive += this.time.elapsed;
  }

}
