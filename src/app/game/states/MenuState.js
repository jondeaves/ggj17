export default class MenuState extends Phaser.State {
  create() {
    // Just to get us started
    this.stage.backgroundColor = '#182d3b';
    this.stateBg = this.add.image(0, 0, 'bg_menu_screen');
    this.stateBg.width = this.game.width;
    this.stateBg.height = this.game.height;

    // Audio
    this.menuSfx = this.game.add.audio('state_menu_music');
    this.menuSfx.onDecoded.add(() => {
      this.menuSfx.loopFull(0.6);
    });

    // Gamepad
    this.game.input.gamepad.start();
    this.gamePad = this.game.input.gamepad.pad1;

    this.hasFinished = false;


    // Key bindings
    this.game.input.onTap.add(this.switchState, this);

    this.game.input.keyboard.onPressCallback = () => {
      this.switchState();
    };
  }

  update() {
    if (this.hasFinished) {
      return;
    }

    //  We can't do this until we know that the gamepad has been connected and is started
    if (
      this.gamePad.justPressed(Phaser.Gamepad.XBOX360_A) ||
      this.gamePad.justPressed(Phaser.Gamepad.XBOX360_B) ||
      this.gamePad.justPressed(Phaser.Gamepad.XBOX360_X) ||
      this.gamePad.justPressed(Phaser.Gamepad.XBOX360_Y) ||
      this.gamePad.justPressed(Phaser.Gamepad.XBOX360_START)
    ) {
      this.switchState();
    }
  }


  switchState() {
    if (!this.game.scale.isFullScreen && !this.game.IsDebug) {
      this.game.scale.startFullScreen(false);
    }

    this.hasFinished = true;
    this.menuSfx.stop();
    this.state.start('GamePlayState', true, false);
  }
}
