import _ from 'lodash';
import { getRandomInt } from '../helpers';
import HordeController from '../objects/HordeController';
import Pickup from '../objects/Pickup';

export default class GamePlayState extends Phaser.State {
  create() {
    this.stateBg = this.add.image(0, 0, 'bg_gameplay_screen');
    this.stateBg.width = this.game.width;
    this.stateBg.height = this.game.height;

    // Generate the world as it begins
    this.generateWorld();
    this.generatePickups();

    // Physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.enable([this.hordeControllers, this.pickups], Phaser.Physics.ARCADE);
  }

  generateWorld() {
    // Setup the horde
    this.hordeControllers = this.add.physicsGroup();
    this.hordeController = new HordeController(this.game, 150, 150, 'sprite_player');
    this.hordeController.addToHorde(4);
    this.hordeControllers.add(this.hordeController);

    // Setup the camera
    this.game.world.setBounds(null);
    this.game.camera.follow(this.hordeController);
  }

  generatePickups() {
    // Setup pickups
    this.pickups = this.game.add.physicsGroup();
    this.pickupTimeBetween = 3000.0;
    this.pickupTimer = 0.0;

    this.pickupDefinitions = [
      {
        id: 0,
        ident: 'food',
        modifier: 'moveSpeed',
        value: 5,
        duration: 5000,
        asset: 'sprite_pickup_speed',
      },
      {
        id: 1,
        ident: 'rubbish',
        modifier: 'moveSpeed',
        value: -2,
        duration: 3000,
        asset: 'sprite_pickup_speed',
      },
    ];
  }

  render() {
    this.game.debug.cameraInfo(this.game.camera, 32, 32);
    this.game.debug.spriteCoords(this.hordeController, 32, 500);
  }

  update() {
    this.updateTimer();

    // Update pickup spawns
    this.spawnPickups();

    // Updates related to hordes
    this.hordeController.update();

    // Physics
    this.game.physics.arcade.collide(this.hordeControllers, this.pickups, this.pickupCollision, null, this);
  }

  updateTimer() {
    if (typeof this.totalTimeActive === 'undefined') {
      this.totalTimeActive = 0;
    }
    this.totalTimeActive += this.time.elapsed;
  }

  pickupCollision(hordeController, pickup) {
    console.log(`Picked up ${pickup.attributes.ident}`);
    hordeController.applyPickup(pickup);
    pickup.destroy();
  }

  spawnPickups() {
    if (this.pickupTimer >= this.pickupTimeBetween) {
      const pickupIdent = getRandomInt(0, this.pickupDefinitions.length - 1);
      const pickupIndex = _.findIndex(this.pickupDefinitions, o => o.id === pickupIdent);
      const generatedPickup = this.pickupDefinitions[pickupIndex];

      this.pickups.add(new Pickup(this.game, 500, 200, generatedPickup));
      this.pickupTimer = 0.0;
    }

    this.pickupTimer += this.game.time.elapsed;
  }

}
