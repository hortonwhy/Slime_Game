// State0 will be the titlescreen
let player_slime, jumpSFX;
var slime = {};
let bullets;
var platform;
var platformGroup, onPlat, hasJumped = true, secondElapsed;
var weapon1, fireRate = 200, nextFire = 0, idleTimer = 10000, nextIdle = 0;
var volumeBtn, settingBtn;
var background, foreground, backgroundGroup, foregroundGroup;
let player = {};
let enemy = {};
var numEnemies = 2; // number of enemies until group problem is fixed
let base_game = {}; // will provide methods for quick creation of a new state
let platforms = {};
var dooropen = false;
var shot = 0; 
//var shot = false; is the enemy shot?
// attempting slime movement to be handled more nicely
player.accel = 400
player.jump_height = 400;
player.gravity = 800;
player.drag = 100
player.fireRate = 200;

// enemy attributes
enemy.speed = 400

player.movement = function() {};
enemy.pacing = function() {};
// can add attribute here to adjust the jump timer, or acceleration of the slime
player.movement.prototype = {
  move: function(input) {
    // weapon for the slime
    if (game.time.now < (nextFire + 2000)) {
      weapon1.x = player_slime.x;
      weapon1.y = player_slime.y;
      weapon1.scale.setTo (player_slime.scale.x * 2.0, player_slime.scale.y * 2.0 )
    } else {
      weapon1.x = -100; weapon1.y = -100;
    }
    // I think velocity feels better for x movement, than accel
    if (input.isDown(Phaser.Keyboard.LEFT)) {
      volume.toggle.prototype.move(volumeBtn);
      player_slime.body.velocity.x = -player.accel;
      player_slime.scale.setTo(-1.5, 1.5);
      player_slime.animations.play('walk', 6, true);
      nextIdle = game.time.now + idleTimer;
    } else if (input.isDown(Phaser.Keyboard.RIGHT)) {
      volume.toggle.prototype.move(volumeBtn);
      player_slime.body.velocity.x = player.accel;
      player_slime.scale.setTo(1.5,1.5);
      player_slime.animations.play('walk', 6, true);
      nextIdle = game.time.now + idleTimer;
    } else {
      player_slime.body.acceleration.x = 0;
      player_slime.body.velocity.x = 0;
      if (game.time.now > nextIdle) {
        player_slime.animations.play('idle', 3, true);
      } else {
      player_slime.frame = 2; // this is for animations to return to first frame
      }
    }
    if (input.isDown(Phaser.Keyboard.UP)) {
      if (player_slime.body.velocity.y == 0) {
        nextIdle = game.time.now + idleTimer;
        player_slime.body.velocity.y = -player.jump_height;
        secondElapsed = game.time.now + 1000;
        hasJumped = true;
      }
    }
  },
  attack: function(input) {
    if (input.isDown(Phaser.Keyboard.F) && game.time.now > nextFire) {
      // Fire projectile in direction of slime
      console.log("F");
      if (vol_state == 1){
          laser.play();
      }
      weapon1.x = player_slime.x;
      weapon1.y = player_slime.y;
      nextIdle = game.time.now + idleTimer;
      var direction = player_slime.scale.x
      console.log(player_slime.scale.x)
      nextFire = game.time.now + player.fireRate;
      var bullet;
      bullet = bullets.getFirstDead();
      bullet.reset(player_slime.x, player_slime.y);
      bullet.rotation = game.physics.arcade.angleToXY(bullet, player_slime.x + (1000 * direction * 1) , player_slime.y)
      game.physics.arcade.moveToXY(bullet, player_slime.x + (direction * 1000 * 1), player_slime.y, 1000);
      bullet.animations.play('fire', 3, true);
    }

    game.physics.arcade.overlap(bullets, enemy1, this.hitEnemy);
    game.physics.arcade.overlap(bullets, enemy2, this.hitEnemy);
  },
  hitEnemy: function(enemy, bullet) {
    shot += 1
    console.log('enemy hit');
    bullet.kill();
    enemy.animations.play('dead',4,true);
    setTimeout(() => enemy.kill(), 1200);
    if (shot == numEnemies){
        portal_slime.animations.play('dooropen', 8, false);
        shot = 0;
        dooropen = true;
    }
    //dooropen = true;
    death.play();
    
  },
  hitPlatform: function() {
    // figure out how to play sound only on intial hit and nothing else
    //console.log("hit plaform");
  }
}
enemy.pacing.prototype = {
    pace: function(object) {
        if (object.body.velocity.x == 0) {
            enemy.speed *= -1;
            object.body.velocity.x = enemy.speed;
            object.animations.play('enemywalk', 8, true);
        }
    }
}

base_game = function() {};
base_game.prototype = {
  // Call base_game.prototype.physics(player_slime); to enable physics and collisions
  physics: function(player_ent) {
    game.physics.enable(player_ent);
    player_ent.body.collideWorldBounds = true;
    player_ent.body.gravity.y = player.gravity;
    player_ent.body.drag.x = player.drag;
    player_ent.anchor.x = 0.5;
    player_ent.anchor.y = 0.5
    player_ent.scale.setTo(1.5, 1.5);
    player_ent.animations.add('idle', [0, 1]);
    player_ent.animations.add('walk', [3, 4]);

    // Enable Volume Button
    volumeBtn = volume.toggle.prototype.mute(sound, -100, -100);
    settingBtn = game.add.button(-900, 20, 'slime-idle', function() {
      hud.funcs.prototype.toggle();

    jumpSFX = game.add.audio('jump')
    });
  },
  projectile: function() {
      bullets = game.add.group();
      bullets.enableBody = true;
      bullets.physicsBodyType = Phaser.Physics.ARCADE;
      bullets.createMultiple(50, 'projectile');
      bullets.setAll('checkWorldBounds', true);
      bullets.setAll('outOfBoundsKill', true);
      bullets.setAll('anchor.y', 0.5);
      bullets.setAll('scale.x', 1);
      bullets.setAll('scale.y', 1);
      bullets.callAll('animations.add', 'animations', 'fire', [0, 1, 2, 3], 3, true);
      bullets.callAll('animations.play', 'animations', 'fire');
      // create a weapon sprite to move as needed
      weapon1 = game.add.sprite(500, 100, 'weapon1');
      weapon1.scale.setTo(3);
      weapon1.anchor.x = 0.5;
      weapon1.anchor.y = 0.5;
  },
  platform_physics: function(platform){
      platformGroup = game.add.group();     
      platform.body.immovable = true;
      platformGroup.setAll('body.immovable', true)  
  },    
  enemy_physics: function(object) {
      game.physics.enable(object);
      player_ent.body.collideWorldBounds = true;
  },
  parallax : function() {
    // trying out background parallax stuff
    background = game.add.sprite(0, 0, 'background');
    foreground = game.add.sprite(0, 0, 'foreground');
    backgroundGroup = game.add.group()
    foregroundGroup = game.add.group()
    var width = game.world.width; var height = game.world.height;
    var currentX = background.width, currentY = background.height; // assuming back and foreground are same
    backgroundGroup.setAll('scale.setTo', width / background.width, height / background.height);
    foregroundGroup.setAll('scale.setTo', width / foreground.width, height / foreground.height);
    while (currentX < width) {
      backgroundGroup.create(currentX, 0, 'background');
      foregroundGroup.create(currentX, 0, 'foreground');
      currentX += background.width
    }
  },
  parallaxMove : function () {
    console.log(backgroundGroup.children.length);
  },
  gameSounds: function (sound) {
    if (secondElapsed > game.time.now && hasJumped) {
      console.log ("play jump sound");
      jumpSFX.volume = 0.5
      jumpSFX.play()
      onPlat = false; hasJumped = false;
    }
  },
}

slime.state0 = function() {};
slime.state0.prototype = {
  preload: function() {
    game.load.spritesheet('slime', 'assets/spritesheet/door.png', 128, 128);
    game.load.spritesheet('slime-idle', 'assets/spritesheet/slime_idle.png', 64, 64);
    game.load.spritesheet('slime-new', 'assets/spritesheet/slime-new.png', 64, 64);
    game.load.spritesheet('slime-new2', 'assets/spritesheet/slime-new2.png', 64, 64);
    game.load.spritesheet('enemy', 'assets/spritesheet/enemy.png',128,128);
    game.load.spritesheet('projectile', 'assets/spritesheet/projectile.png', 64, 64);
    game.load.image('weapon1', 'assets/sprites/basic-weapon.png');
    game.load.image('slime_static', 'assets/sprites/slime_static.png');
    game.load.image('bullet', 'assets/sprites/bullet.png');
    game.load.image('platform', 'assets/sprites/platform.png');
    game.load.image('background', 'assets/sprites/background-high-res.png');
    game.load.image('foreground', 'assets/sprites/foreground-high-res.png');
    game.load.audio('laser','assets/sounds/laser.wav');
    game.load.audio('jump', 'assets/sounds/jump-sfx.mp3');
    game.load.audio('enemy_death','assets/sounds/enemy_dies.m4a');
  },

  create: function() {

    game.world.setBounds(0, 0, 5000, 1000); // important to be called early if not first
    base_game.prototype.parallax();

    // add laser sounds
    laser = game.add.audio("laser");
    jumpSFX = game.add.audio('jump')
    jumpSFX.volume = 0.3
    death = game.add.audio("enemy_death");

    game.stage.backgroundColor = "#dddddd";
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    player_slime = game.add.sprite(100, 100, "slime-new");
    enemy1 = game.add.sprite(1500, 800, 'enemy');
    enemy2 = game.add.sprite(800, 800, 'enemy');
    player_slime.scale.setTo(0.7, 0.7);
    portal_slime = game.add.sprite(1000, 800, "slime");
    portal_slime.scale.setTo(1.5, 1.5);
    game.physics.enable(portal_slime);
      
    // add the walking animation for the enemy
    enemy1.animations.add('enemywalk', [0, 1, 2, 3]);
    enemy1.animations.add('dead',[4]);
    enemy2.animations.add('enemywalk', [0, 1, 2, 3]);
    enemy2.animations.add('dead',[4]);
    portal_slime.animations.add('dooropen',[1,2,3,4,5,6,7,8]);

    // add the platforms
    platform = game.add.sprite(0, 950, 'platform');
    platformGroup = game.add.group();
    platformGroup.create(310, 850, 'platform');
    platformGroup.create(620, 800, 'platform');
    platformGroup.create(960, 720, 'platform');

    // add collide with the platforms
    game.physics.enable([player_slime, platform, platformGroup]);
    player_slime.body.collideWorldBounds = true;
    platform.body.immovable = true;
    platformGroup.setAll('body.immovable', true);

    // custom call, shortens work and declutters the code. 
    base_game.prototype.physics(player_slime);
    base_game.prototype.physics(enemy1);
    base_game.prototype.physics(enemy2);
    base_game.prototype.projectile();

    //camera
    game.camera.follow(player_slime);

    // enabling hud pass button objects in the array
    hud.funcs.prototype.set([volumeBtn]);
    hud.funcs.prototype.toggle()
      
    
      
    
  },
  update: function() {
    game.physics.arcade.collide(player_slime, [platform, platformGroup], player.movement.prototype.hitPlatform);
    player.movement.prototype.move(game.input.keyboard);
    game.physics.arcade.overlap(player_slime, portal_slime, this.hitPortal);
    base_game.prototype.gameSounds();

    player.movement.prototype.attack(game.input.keyboard);
    hud.funcs.prototype.move(settingBtn);


    if (shot < numEnemies){
        enemy.pacing.prototype.pace(enemy1);
        enemy.pacing.prototype.pace(enemy2);
    }
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
