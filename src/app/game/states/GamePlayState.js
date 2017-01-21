import _ from 'lodash';
import { getRandomInt } from '../helpers';
import HordeController from '../objects/HordeController';
import Wave from '../objects/Wave';
import Pickup from '../objects/Pickup';
import Seagull from '../objects/Seagull';

export default class GamePlayState extends Phaser.State {
  create() {
    this.stage.backgroundColor = '#9c7c63';

    this.stateBg = this.add.image(0, 0, 'bg_gameplay_screen');
    this.stateBg.width = this.game.width;
    this.stateBg.height = this.game.height;

    // Generate the world as it begins
    this.generateWorld();
    this.generateWater();
    this.generatePickups();

    // Physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.enable([this.hordeControllers, this.pickups], Phaser.Physics.ARCADE);
  }

  generateWorld() {
    // Setup the horde
    this.hordeControllers = this.add.physicsGroup();
    this.hordeController = new HordeController(this.game, 450, 150, 'sprite_player');
    this.hordeController.addToHorde(4);
    this.hordeControllers.add(this.hordeController);

    // Setup seagulls
    this.seagullGroup = this.add.physicsGroup();
    this.seagullGroup.add(new Seagull(this.game, 20, 20, this.hordeController));

    // Setup the camera
    this.game.world.setBounds(null);
    this.game.camera.follow(this.hordeController);
  }

  generateWater() {
    this.waveGroup = this.add.physicsGroup();
    this.waveGroup.add(new Wave(this.game, 50, 200));
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

  update() {
    this.updateTimer();

    // Update pickup spawns
    this.spawnPickups();

    this.cleanup();

    // Physics
    this.seagullGroup.forEach((gull) => {
      gull.updateHordeControllers(this.hordeControllers);
    });

    // Player colliding with pickups
    this.game.physics.arcade.collide(this.hordeControllers, this.pickups, this.pickupCollision, null, this);

    // Player colliding with wave
    this.game.physics.arcade.collide(this.hordeControllers, this.waveGroup, this.waveCollision, null, this);
  }

  cleanup() {
    this.seagullGroup.forEach((seagull) => {
      if (seagull.x >= this.game.width || seagull.y >= this.game.height) {
        seagull.destroy();
      }
    });
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

  waveCollision(hordeController, wave) {
    if (wave.isMovingTowardLand) {
      hordeController.targetLocked = wave;
      hordeController.targetLockedPreviousPos = { x: wave.x, y: wave.y }
    } else {
      hordeController.targetLocked = false;
    }
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
