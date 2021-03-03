// State0 will be the titlescreen
let player_slime;
var slime = {};
let bullets;
var platform;
var platformGroup;
var fireRate = 200, nextFire = 0;
var volumeBtn;
var background, foreground;
let player = {};
let enemy = {};
let base_game = {}; // will provide methods for quick creation of a new state
let platforms = {};
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
    // I think velocity feels better for x movement, than accel
    if (input.isDown(Phaser.Keyboard.LEFT)) {
      player_slime.body.velocity.x = -player.accel;
      player_slime.scale.setTo(0.7, 0.7);
      player_slime.animations.play('walk', 12, true);
    } else if (input.isDown(Phaser.Keyboard.RIGHT)) {
      player_slime.body.velocity.x = player.accel;
      player_slime.scale.setTo(-0.7,0.7);
      player_slime.animations.play('walk', 12, true);
      //player_slime.body.acceleration.x = player.accel;
    } else {
      player_slime.body.acceleration.x = 0;
      player_slime.body.velocity.x = 0;
      player_slime.frame = 0; // this is for animations to return to first frame
    }
    if (input.isDown(Phaser.Keyboard.UP)) {
      if (player_slime.body.velocity.y == 0) {
        player_slime.body.velocity.y = -player.jump_height;
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
      var direction = player_slime.scale.x
      console.log(player_slime.scale.x)
      nextFire = game.time.now + player.fireRate;
      var bullet;
      bullet = bullets.getFirstDead();
      bullet.reset(player_slime.x, player_slime.y);
      bullet.rotation = game.physics.arcade.angleToXY(bullet, player_slime.x + (1000 * direction * -1) , player_slime.y)
      game.physics.arcade.moveToXY(bullet, player_slime.x + (direction * 1000 * -1), player_slime.y, 1000);
    }
    game.physics.arcade.overlap(bullets, enemy1, this.hitEnemy);
  },
  hitEnemy: function(enemy, bullet) {
    console.log('enemy hit');
    bullet.kill()
  }
}
enemy.pacing.prototype = {
    pace: function(object) {
        if (object.body.velocity.x == 0) {
            console.log('pacing')
            enemy.speed *= -1
            object.body.velocity.x = enemy.speed
        }
        console.log('after')
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
    player_ent.scale.setTo(0.7, 0.7);
    player_ent.animations.add('walk', [0, 1, 2]);
  },
  projectile: function() {
      bullets = game.add.group();
      bullets.enableBody = true;
      bullets.physicsBodyType = Phaser.Physics.ARCADE;
      bullets.createMultiple(50, 'bullet');
      bullets.setAll('checkWorldBounds', true);
      bullets.setAll('outOfBoundsKill', true);
      bullets.setAll('anchor.y', 0.5);
      bullets.setAll('scale.x', 0.85);
      bullets.setAll('scale.y', 0.85);
      // bullet
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
    /* need a repeating foreground, background
     * likely on the basis of getting the game.world.bounds.x and y
     * and using them to make sure they are filled with the width and height
     * of the background and foreground sizes
     * so loop and add the same sprites after every width of the image
     * so the sprite for the background is 2000, the world bounds are 5000
     * so it would need to add the sprite three times, once every 2000 pixels
     */
    console.log(" background: " + background.width + " " + background.height);
    var width = game.width; var height =  game.height;
    console.log("bound", game.world);
    background.scale.setTo(width / background.width, height / background.height);
    foreground.scale.setTo(width / foreground.width, height / foreground.height);
    console.log(width, height);
  },
  parallaxMove : function () {
  },
}

slime.state0 = function() {};
slime.state0.prototype = {
  preload: function() {
    game.load.spritesheet('slime', 'assets/spritesheet/slime_backup.png', 205, 130);
    game.load.image('slime_static', 'assets/sprites/slime_static.png');
    game.load.image('bullet', 'assets/sprites/bullet.png');
    game.load.image('enemy', 'assets/sprites/enemy.png');
    game.load.image('platform', 'assets/sprites/platform.png');
    game.load.image('background', 'assets/sprites/background-high-res.png');
    game.load.image('foreground', 'assets/sprites/foreground-high-res.png');
    game.load.audio('laser','assets/sounds/laser.wav');
  },

  create: function() {
    base_game.prototype.parallax();

    // add laser sounds
    laser = game.add.audio("laser");

    game.stage.backgroundColor = "#dddddd";
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    player_slime = game.add.sprite(100, 100, "slime");
    enemy1 = game.add.sprite(1500, 800, 'enemy');
    player_slime.scale.setTo(0.7, 0.7);
    portal_slime = game.add.sprite(1000, 800, "slime");
    game.physics.enable(portal_slime);

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
    base_game.prototype.physics(enemy1)
   // base_game.prototype.physics(enemy);
    base_game.prototype.projectile();

    game.world.setBounds(0, 0, 5000, 1000);

    // Enable Volume Button
    volumeBtn = volume.toggle.prototype.mute(sound, 800, 500);

    //camera
    game.camera.follow(player_slime);
  },
  update: function() {
    game.physics.arcade.collide(player_slime, [platform, platformGroup]);
    player.movement.prototype.move(game.input.keyboard);
    game.physics.arcade.overlap(player_slime, portal_slime, this.hitPortal);

    player.movement.prototype.attack(game.input.keyboard);

    enemy.pacing.prototype.pace(enemy1);

    // allows buttons to follow the player
    volume.toggle.prototype.move(volumeBtn);

  },

  hitPortal: function() {
    console.log("hit portal");
    changeState(1);
  },
}

function changeState (stateNum) {
  console.log("state" + stateNum);
  game.state.start("state" + stateNum);
}
