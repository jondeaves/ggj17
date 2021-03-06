export default class LoadingState extends Phaser.State {
  create() {
    // Just to get us started
    this.stage.backgroundColor = '#182d3b';

    // Hook into some load events
    this.game.load.onLoadStart.add(this.loadStart, this);
    this.game.load.onFileComplete.add(this.fileComplete, this);
    this.game.load.onLoadComplete.add(this.loadComplete, this);

    // Begin the load
    this.game.load.pack('splashScreen', './assets/asset-pack.json', null, this);
    this.game.load.pack('menuScreen', './assets/asset-pack.json', null, this);
    this.game.load.pack('instructionScreen', './assets/asset-pack.json', null, this);
    this.game.load.pack('gameplayScreen', './assets/asset-pack.json', null, this);
    this.game.load.pack('gameoverScreen', './assets/asset-pack.json', null, this);
    this.game.load.pack('victoryScreen', './assets/asset-pack.json', null, this);

    this.game.load.start();
  }

  loadStart() {
    this.text = this.add.text(32, 32, 'Loading...', { fill: '#ffffff' });
  }

  fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
    this.text.setText(`File Complete: ${progress}% - ${totalLoaded} out of ${totalFiles}`);
  }

  loadComplete() {
    this.text.setText('Load Complete');
    this.state.start('SplashState', true, false);
    // this.state.start('GamePlayState', true, false);
    // this.state.start('VictoryState', true, false);
    // this.state.start('GameOverState', true, false);
  }
}
