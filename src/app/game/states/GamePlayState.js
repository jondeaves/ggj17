import _ from 'lodash';
import { getRandomInt } from '../helpers';
import HordeController from '../objects/HordeController';
import QueenCrab from '../objects/QueenCrab';
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
        this.backgroundMusic.fadeTo(4000, 0.2);
      }, 3000);
    }, this);

    this.backgroundWaveMusic = this.game.add.audio('AMB_waves');
    this.backgroundWaveMusic.onDecoded.add(() => {
      setTimeout(() => {
        this.backgroundWaveMusic.loopFull(0);
        this.backgroundWaveMusic.fadeTo(4000, 0.4);
      }, 3000);
    }, this);

    this.transitionMusic = this.game.add.audio('trans_wave');
    this.combatMusic = this.game.add.audio('state_combat_music');


    // Text
    const style = {
      font: 'bold 32px Arial',
      fill: '#333333',
    };

    // Health and kills
    this.healthText = this.game.add.text(10, 10, 'Health: 0', style);
    this.healthText.fixedToCamera = true;
    this.healthText.cameraOffset.setTo(10, 10);

    this.killText = this.game.add.text(10, 50, 'Kills: 0', style);
    this.killText.fixedToCamera = true;
    this.killText.cameraOffset.setTo(10, 50);


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
    this.game.world.sendToBack(this.queenCrabGroup);
    this.game.world.sendToBack(this.enemyCrabGroup);

    this.game.world.sendToBack(this.pickups);
    this.game.world.sendToBack(this.bgLayer1);        // Algae
    this.game.world.sendToBack(this.bgLayer0);        // Sand and road

    // States
    this.inCombat = false;


    //
    // Try and unbind previous keys from menu
    this.game.input.onTap.add(() => {}, this);
    this.game.input.keyboard.onPressCallback = null;


    this.crabSpawnArea = [0, 0, 3690, 1755];
    this.lastCrabSpawn = 0;
    this.crabSpawnRate = 30;

    this.seagullSpawnArea = [4590, 0, 7580, 1755];
    this.lastSeagullSpawn = 0;
    this.seagullSpawnRate = 20;
  }

  generateWorld() {
    // Setup the horde
    this.hordeControllers = this.add.physicsGroup();
    this.hordeController = new HordeController(this.game);
    this.hordeControllers.add(this.hordeController);

    // Setup seagulls
    this.seagullGroup = this.add.group();
    this.seagullGroup.add(new Seagull(this.game, 8000, 20, this.hordeController));


    // Setup queen crab
    this.queenCrabGroup = this.add.physicsGroup();
    this.queenCrabGroup.add(new QueenCrab(this.game, 20, 500));


    // Setup enemy crab
    this.enemyCrabGroup = this.add.physicsGroup();

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
        ident: 'coffee',
        modifier: 'moveSpeed',
        value: 5,
        duration: 5000,
        spawnRate: 15,
        spawnArea: [4480, 0, 7580, 1755],
        asset: 'sprite_pickup_coffee',
        scale: 0.2,
        lastSpawn: 0,
      },
      {
        id: 0,
        ident: 'badcoffee',
        modifier: 'moveSpeed',
        value: -3,
        duration: 3000,
        spawnRate: 15,
        spawnArea: [4480, 0, 7580, 1755],
        asset: 'sprite_pickup_coffee_stale',
        scale: 0.2,
        lastSpawn: 0,
      },

      {
        id: 1,
        ident: 'shelly',
        modifier: 'members',
        value: 1,
        duration: 0,
        spawnRate: 10,
        spawnArea: [0, 0, 3890, 1755],
        asset: 'sprite_pickup_shelly',
        scale: 0.3,
        lastSpawn: 0,
      },
    ];
  }

  update() {
    if (this.hasWon) {
      return;
    }

    // Check if horde controller is dead
    if (this.hordeController.isDead === true) {
      this.backgroundMusic.stop();
      this.game.state.start('GameOverState', true, false);
    }


    this.updateTimer();

    // Update pickup spawns
    this.spawnPickups();
    this.spawnCrabs();
    this.spawnSeagulls();

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
    // Player colliding with queen crab
    this.queenCrabGroup.forEach((queenCrab) => {
      const queenCrabBound = queenCrab.getBounds();
      const hordeBounds = this.hordeController.getBounds();

      // Does this seagull overlap with the horde controller
      const hordeCrabCollision = Phaser.Rectangle.intersects(queenCrabBound, hordeBounds);
      if (hordeCrabCollision) {
        if (this.hordeController.getHealth() > queenCrab.health) {
          // Win
          this.hasWon = true;

          this.menuWaveSfx.fadeOut(0.5);
          this.backgroundMusic.fadeOut(0.5);
          this.backgroundWaveMusic.fadeOut(0.5);
          this.transitionMusic.fadeOut(0.5);
          this.combatMusic.fadeOut(0.5);
          setTimeout(() => {
            this.state.start('VictoryState', true, false);
          }, 500);
        } else {
          // Sent back and lose some crabs
          this.hordeController.queenFail();
          console.log('sending back and losing crabs');
        }
      }
    });

    //
    // Player colliding with large crab
    let crabCollision = false;
    this.enemyCrabGroup.forEach((bigCrab) => {
      const bigCrabBound = bigCrab.getBounds();
      const hordeBounds = this.hordeController.getBounds();

      // Does this seagull overlap with the horde controller
      const hordeCrabCollision = Phaser.Rectangle.intersects(bigCrabBound, hordeBounds);
      console.log(hordeCrabCollision);
      if (hordeCrabCollision && !bigCrab.isDead) {
        // Battle
        crabCollision = true;
        this.triggerCombat();
        bigCrab.attackTarget = this.hordeController;
        this.hordeController.attackTarget = bigCrab;
      } else {
        // No battle
        bigCrab.attackTarget = null;
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

        if (seagull.canAttack) {
          seagull.canAttack = false;
          this.hordeController.attacked();
        }
      }
    });


    // Update GUI text
    this.healthText.text = `Health: ${this.hordeController.getHealth()}`;
    this.killText.text = `Kills: ${this.hordeController.killCount}`;
  }

  triggerCombat() {
    if (this.inCombat) {
      return;
    } else {
      this.inCombat = true;

      // Fade out normal music
      this.backgroundMusic.fadeOut(0.5);

      // Fade in transition
      this.transitionMusic.fadeIn(0.5);

      // Start combat after one second
      console.log('combat music playing in 5 seconds');
      setTimeout(() => {
        console.log('combat music playing');
        this.combatMusic.loopFull(0);
      }, 5000);

    }
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
    this.game.totalSecondsActive = parseInt(this.totalTimeActive / 1000);
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

  spawnCrabs() {
    const canSpawn = (
      this.game.totalSecondsActive !== this.lastCrabSpawn &&
      (this.game.totalSecondsActive / this.crabSpawnRate) % 1 === 0
    );

    if (canSpawn || this.enemyCrabGroup.length === 0) {
      this.lastCrabSpawn = this.game.totalSecondsActive;
      //crabSpawnArea
      console.log('spawning crab');

      const posX = this.game.rnd.integerInRange(this.crabSpawnArea[0] + 50, this.crabSpawnArea[2] - 50);
      const posY = this.game.rnd.integerInRange(this.crabSpawnArea[1] + 50, this.crabSpawnArea[3] - 50);

      this.enemyCrabGroup.add(new EnemyCrab(this.game, posX, posY));
    }
  }

  spawnSeagulls() {
    const canSpawn = (
      this.game.totalSecondsActive !== this.lastSeagullSpawn &&
      (this.game.totalSecondsActive / this.seagullSpawnRate) % 1 === 0
    );

    if (canSpawn || this.seagullGroup.length === 0) {
      this.lastSeagullSpawn = this.game.totalSecondsActive;
      console.log('spawning seagull');

      const posX = this.game.rnd.integerInRange(this.seagullSpawnArea[0] + 50, this.seagullSpawnArea[2] - 50);
      const posY = this.game.rnd.integerInRange(this.seagullSpawnArea[1] + 50, this.seagullSpawnArea[3] - 50);

      this.seagullGroup.add(new Seagull(this.game, posX, posY, this.hordeController));
    }
  }

  spawnPickups() {
    this.pickupDefinitions.forEach((pickup) => {

      const canSpawn = (
        this.game.totalSecondsActive !== pickup.lastSpawn &&
        (this.game.totalSecondsActive / pickup.spawnRate) % 1 === 0
      );

      if (canSpawn) {
        pickup.lastSpawn = this.game.totalSecondsActive;

        const posX = this.game.rnd.integerInRange(pickup.spawnArea[0] + 50, pickup.spawnArea[2] - 50);
        const posY = this.game.rnd.integerInRange(pickup.spawnArea[1] + 50, pickup.spawnArea[3] - 50);

        this.pickups.add(new Pickup(this.game, posX, posY, pickup));
      }
    });
  }

}
