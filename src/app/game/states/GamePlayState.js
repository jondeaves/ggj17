import _ from 'lodash';
import { getRandomInt } from '../helpers';
import HordeController from '../objects/HordeController';
import EnemyCrab from '../objects/EnemyCrab';
import Wave from '../objects/Wave';
import Pickup from '../objects/Pickup';
import Seagull from '../objects/Seagull';
import Umbrella from '../objects/Umbrella';

export default class GamePlayState extends Phaser.State {
  create() {
    this.stage.backgroundColor = '#9c7c63';

    this.bgLayer0 = this.add.image(0, 0, 'sprite_bg_layer_0');
    this.bgLayer1 = this.add.image(0, 0, 'sprite_bg_layer_1');
    this.bgLayer2 = this.add.image(0, 0, 'sprite_bg_layer_2');


    // Generate the world as it begins
    this.generateWorld();
    this.generateWater();
    this.generatePickups();

    // Physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.enable([this.hordeControllers, this.pickups], Phaser.Physics.ARCADE);

    // Audio
    this.menuWaveSfx = this.game.add.audio('SFX_wave_triggered');
    this.menuWaveSfx.onDecoded.add(() => {
      this.menuWaveSfx.volume = 0.1;
      this.menuWaveSfx.play();
      this.menuWaveSfx.fadeOut(3000);
    }, this);

    this.backgroundMusic = this.game.add.audio('state_walking_music');
    this.backgroundMusic.onDecoded.add(() => {
      setTimeout(() => {
        this.backgroundMusic.loopFull(0);
        this.backgroundMusic.fadeTo(4000, 0.4);
      }, 3000);
    }, this);


    // Text
    const style = {
      font: 'bold 32px Arial',
      fill: '#333333',
    };

    // Health and kills
    this.healthText = this.game.add.text(0, 0, 'Health: 0', style);
    this.killText = this.game.add.text(0, 30, 'Kills: 0', style);


    // Sprite ordering
    this.game.world.sendToBack(this.healthText);
    this.game.world.sendToBack(this.killText);
    this.game.world.sendToBack(this.seagullGroup);
    this.game.world.sendToBack(this.umbrellaGroup);
    this.game.world.sendToBack(this.waveGroup);
    this.game.world.sendToBack(this.bgLayer2);        // Water overlay

    this.game.world.sendToBack(this.hordeControllers);
    this.hordeControllers.forEach((hordeController) => {
      // Horde controller and members appear under water but above pickups
      this.game.world.sendToBack(hordeController.members);
    });

    this.game.world.sendToBack(this.pickups);
    this.game.world.sendToBack(this.bgLayer1);        // Algae
    this.game.world.sendToBack(this.bgLayer0);        // Sand and road
  }

  generateWorld() {
    // Setup the horde
    this.hordeControllers = this.add.physicsGroup();
    // this.hordeController = new HordeController(this.game, 8000, 400, 'sprite_hermy');
    this.hordeController = new HordeController(this.game, 4600, 400, 'sprite_hermy');
    this.hordeController.addToHorde(4);
    this.hordeControllers.add(this.hordeController);

    // Setup seagulls
    this.seagullGroup = this.add.group();
    this.seagullGroup.add(new Seagull(this.game, 8000, 20, this.hordeController));

    // Setup enemy crab
    this.enemyCrabGroup = this.add.physicsGroup();
    this.enemyCrabGroup.add(new EnemyCrab(this.game, 4800, 100));

    // Setup enemy crab
    this.umbrellaGroup = this.add.physicsGroup();
    this.umbrellaGroup.add(new Umbrella(this.game, 6920, 160));
    this.umbrellaGroup.add(new Umbrella(this.game, 6920, 1080));

    // Setup the camera
    this.game.world.setBounds(0, 0, this.game.constants.world.bounds.width, this.game.constants.world.bounds.height);
    this.game.camera.follow(this.hordeController);
  }

  generateWater() {
    this.waveGroup = this.add.physicsGroup();
    this.waveGroup.add(new Wave(this.game, 1900, -290));
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
        asset: 'sprite_pickup_shelly',
        scale: 0.3,
      },
      {
        id: 1,
        ident: 'rubbish',
        modifier: 'moveSpeed',
        value: -2,
        duration: 3000,
        asset: 'sprite_pickup_shelly',
        scale: 0.3,
      },
    ];
  }

  update() {
    // Check if horde controller is dead
    if (this.hordeController.isDead === true) {
      this.backgroundMusic.stop();
      this.game.state.start('GameOverState', true, false);
    }


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

    // Player colliding with wave
    this.game.physics.arcade.collide(this.hordeControllers, this.umbrellaGroup, this.umbrellaCollision, null, this);


    //
    // Player colliding with large crab
    this.enemyCrabGroup.forEach((bigCrab) => {
      const bigCrabBound = bigCrab.getBounds();
      const hordeBounds = this.hordeController.getBounds();

      // Does this seagull overlap with the horde controller
      const hordeCrabCollision = Phaser.Rectangle.intersects(bigCrabBound, hordeBounds);
      if (hordeCrabCollision && !bigCrab.isDead) {
        // Battle
        bigCrab.attackTarget = this.hordeController;
        this.hordeController.attackTarget = bigCrab;
      } else {
        // No battle
        bigCrab.attackTarget = null;
        this.hordeController.attackTarget = null;
      }
    });


    // Check if seagull is colliding with horde but not umbrella
    this.seagullGroup.forEach((seagull) => {
      const seagullBound = seagull.getBounds();
      const hordeBounds = this.hordeController.getBounds();

      // Does this seagull overlap with the horde controller
      const hordeSeagullCollision = Phaser.Rectangle.intersects(seagullBound, hordeBounds);

      // Is this seagull on top of an umbrella
      let umbrellaCollide = false;
      this.umbrellaGroup.forEach((umbrella) => {
        if (Phaser.Rectangle.intersects(seagullBound, umbrella.getBounds())) {
          umbrellaCollide = true;
        }
      });

      if (hordeSeagullCollision === true && umbrellaCollide === false) {
        seagull.setLastCollision(this.totalTimeActive);

        if (seagull.canAttack && seagull.checkAttackChance()) {
          seagull.canAttack = false;
          this.hordeController.attacked();
        }
      }
    });


    // Update GUI text
    this.healthText.text = `Health: ${this.hordeController.getHealth()}`;
    this.killText.text = `Kills: ${this.hordeController.killCount}`;
  }

  cleanup() {
    this.seagullGroup.forEach((seagull) => {
      if (seagull.x >= this.game.constants.world.bounds.width || seagull.y >= this.game.constants.world.bounds.height) {
        seagull.destroy();
      }
    });


    this.enemyCrabGroup.forEach((bigCrab) => {
      if (bigCrab.isDead) {
        bigCrab.destroy();
      }
    });
  }

  updateTimer() {
    if (typeof this.totalTimeActive === 'undefined') {
      this.totalTimeActive = 0;
    }
    this.totalTimeActive += this.time.elapsed;
    this.game.totalTimeActive = this.totalTimeActive;
  }

  pickupCollision(hordeController, pickup) {
    hordeController.applyPickup(pickup);
    pickup.destroy();
  }

  waveCollision(hordeController, wave) {
    if (!wave.isResetting) {
      wave.target = hordeController;
      hordeController.targetLocked = wave;
      hordeController.targetLockedPreviousPos = { x: wave.x, y: wave.y }
    } else {
      wave.target = null;
      hordeController.targetLocked = false;
    }
  }

  seagullUmbrellaCollision(umbrella, seagull) {
    seagull.setLastCollision(this.totalTimeActive);
  }

  umbrellaCollision(hordeController, umbrella) {
    umbrella.setLastCollision(this.totalTimeActive);
  }

  seagullCollision(hordeController, seagull) {
    if (seagull.canAttack) {
      hordeController.attacked();
    }
  }

  spawnPickups() {
    if (this.pickupTimer >= this.pickupTimeBetween) {
      const pickupIdent = getRandomInt(0, this.pickupDefinitions.length - 1);
      const pickupIndex = _.findIndex(this.pickupDefinitions, o => o.id === pickupIdent);
      const generatedPickup = this.pickupDefinitions[pickupIndex];

      this.pickups.add(new Pickup(this.game, 4600, 200, generatedPickup));
      this.pickupTimer = 0.0;
    }

    this.pickupTimer += this.game.time.elapsed;
  }

}
