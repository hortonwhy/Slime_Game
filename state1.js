let tutorial = {};
var firstPause = true, arrowKeys = false, contBtn = false;

tutorial = function () {};
tutorial.prototype = {
  state: function () {
    if (game.time.now > timeInTitle + 1000 && firstPause) {
      game.paused = true;
      firstPause = false;
      tutorial.prototype.controls()
    }

    else if (arrowKeys) {
      console.log("next tut");
    }
  },
  continueBtn: function() {
    if (contBtn) {
      contBtn = false;
    } else {
      continueBtnn = game.add.button(CenterX, CenterY + 100, "blankBtn", function() {
        controlText.kill()
        continueBtnn.kill();
        game.paused = false;
      });
      continueBtnn.anchor.setTo(0.5, 0.5);
      continueBtnn.scale.x = 8;
      continueBtnn.scale.y = 2;
      contBtn = true;
    }
  },
  controls: function() {
    controls = "Use the arrow keys to move left and right, and jump up and down"
    controlText = game.add.text(CenterX, CenterY, "[" + controls + "]", {font: "32px Monospace"});
    controlText.anchor.setTo(0.5, 0.5);
    tutorial.prototype.continueBtn();
  }
}

slime.state1 = function() {};
slime.state1.prototype = {
  preload: function() {
    game.load.spritesheet('door', 'assets/spritesheet/door.png', 128, 128);
    game.load.spritesheet('slime-idle', 'assets/spritesheet/slime_idle.png', 64, 64);
    game.load.spritesheet('slime-new', 'assets/spritesheet/slime-new.png', 64, 64);
    game.load.spritesheet('slime-new2', 'assets/spritesheet/slime-new2.png', 64, 64);
    game.load.spritesheet('enemy', 'assets/spritesheet/enemy.png',128,128);
    game.load.spritesheet('projectile', 'assets/spritesheet/projectile.png', 64, 64);
    game.load.image('weapon1', 'assets/sprites/basic-weapon.png');
    game.load.image('slime_static', 'assets/sprites/slime_static.png');
    game.load.image('bullet', 'assets/sprites/bullet.png');
    game.load.image('platform', 'assets/sprites/platform.png');
    game.load.image('background', 'assets/sprites/background.png');
    game.load.image('foreground', 'assets/sprites/foreground.png');
    game.load.image('rock-ground', 'assets/sprites/rock_ground.png');
    game.load.audio('laser','assets/sounds/laser.wav');
    game.load.audio('jump', 'assets/sounds/jump-sfx.mp3');
    game.load.audio('enemy_death','assets/sounds/enemy_dies.m4a');
    game.load.audio('playerLand', 'assets/sounds/thud.wav');

  },

  create: function() {

    game.world.setBounds(0, 0, 5000, 1000); // important to be called early if not first
    var gameX = game.world.bounds.width; gameY = game.world.bounds.height;
    base_game.prototype.parallax();

    // add game sounds
    // Add them to array so mute works too
    // I'd like to make this into a separate function. like base_game.prototye.sounds()
    laser = game.add.audio("laser");
    jumpSFX = game.add.audio('jump')
    jumpSFX.volume = 0.3
    death = game.add.audio("enemy_death");
    thud = game.add.audio('playerLand');
    soundsArray = [laser, jumpSFX, death, thud];

    game.stage.backgroundColor = "#dddddd";
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    player_slime = game.add.sprite(100, 100, "slime-new");
    player_slime.scale.setTo(0.7, 0.7);

    portal_slime = game.add.sprite(gameX - 500, 300, "door");
    portal_slime.scale.setTo(1.5, 1.5);
    game.physics.enable(portal_slime);

    portal_slime.animations.add('dooropen',[1,2,3,4,5,6,7,8]);

    // add the platforms
    base_game.prototype.genPlatforms(game.world.bounds.width, game.world.bounds.height, "tut")

    // add collide with the platforms
    game.physics.enable([player_slime, platformGroup, rockGroup]);
    player_slime.body.collideWorldBounds = true;
    platformGroup.setAll('body.immovable', true);
    rockGroup.setAll('body.immovable', true);

    // custom call, shortens work and declutters the code. 
    base_game.prototype.physics(player_slime);
    base_game.prototype.projectile();

    //camera
    game.camera.follow(player_slime);

    // enabling hud pass button objects in the array
    hud.funcs.prototype.push([volumeBtn]);
    hud.funcs.prototype.toggle() // toggle visibility off
    hud.funcs.prototype.move(settingBtn, game.camera.x + 500, 30);
    hud.funcs.prototype.move(volumeBtn, game.camera.x + 900, 50);

    //score time set the intial text location
    //scoreFunc.prototype.start();

    // enemy group init
    enemyFunc.prototype.initialize('enemy');
    //enemyFunc.prototype.manualSpawn(500, 500);


  },
  update: function() {
    game.physics.arcade.collide(player_slime, [platformGroup], player.movement.prototype.hitPlatform);
    game.physics.arcade.collide(player_slime, [rockGroup]);
    game.physics.arcade.collide(enemyGroup, [rockGroup, player_slime, platformGroup]);
    player.movement.prototype.move(game.input.keyboard);
    game.physics.arcade.overlap(player_slime, portal_slime, this.hitPortal);
    base_game.prototype.gameSounds();

    player.movement.prototype.attack(game.input.keyboard);


    //enemyFunc.prototype.chase(enemyGroup, enemySpeed); // Can change speed
    //enemyFunc.prototype.dynamicSpawn();

    // keeps score up to date
    //scoreFunc.prototype.update()
    
    tutorial.prototype.state()
  },

  hitPortal: function() {
    console.log("hit portal");
    if (dooropen){
        changeState(1);
    }
  },
}

function changeState (stateNum) {
  console.log("state" + stateNum);
  game.state.start("state" + stateNum);
}
