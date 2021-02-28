// State0 will be the titlescreen

let player_slime;
var slime = {};
var bullets;
var bullet, fireRate = 200, nextFire = 0;
let player = {};
let base_game = {}; // will provide methods for quick creation of a new state

// attempting slime movement to be handled more nicely
player.accel = 400
player.jump_height = 400;
player.gravity = 800;
player.drag = 100
player.fireRate = 200;

player.movement = function() {};
// can add attribute here to adjust the jump timer, or acceleration of the slime
player.movement.prototype = {
  move: function(input) {
    // I think velocity feels better for x movement, than accel
    if (input.isDown(Phaser.Keyboard.LEFT)) {
      //player_slime.body.acceleration.x = -player.accel;
      player_slime.body.velocity.x = -player.accel;
      player_slime.scale.setTo(0.7, 0.7);
    } else if (input.isDown(Phaser.Keyboard.RIGHT)) {
      player_slime.body.velocity.x = player.accel;
      player_slime.scale.setTo(-0.7,0.7);
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
      var direction = player_slime.scale.x
      console.log(player_slime.scale.x)
      nextFire = game.time.now + player.fireRate;
      //bullets.create(player_slime.x, player_slime.y, 'bullet');
      bullet = bullets.getFirstDead();
      bullet.reset(player_slime.x, player_slime.y);
      console.log(bullet.x, bullet.y, player_slime.x, player_slime.y);
      bullet.rotation = game.physics.arcade.angleToXY(bullet, player_slime.x + (1000 * direction * -1) , player_slime.y)
      game.physics.arcade.moveToXY(bullet, player_slime.x + (direction * 1000 * -1), player_slime.y, 1000);

    }
  },
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
  },
}

slime.state0 = function() {};
slime.state0.prototype = {
  preload: function() {
    game.load.image('slime', 'assets/sprites/slime_static.png');
    game.load.image('bullet', 'assets/sprites/bullet.png');
  },

  create: function() {

    game.stage.backgroundColor = "#dddddd";
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    player_slime = game.add.sprite(100, 100, "slime");
    player_slime.scale.setTo(0.7, 0.7);
    portal_slime = game.add.sprite(1000, 700, "slime");
    game.physics.enable(portal_slime);

    // custom call, shortens work and declutters the code. 
    base_game.prototype.physics(player_slime);
    base_game.prototype.projectile();

    game.world.setBounds(0, 0, 2000, 1000);

    //camera
    game.camera.follow(player_slime);
  },
  update: function() {
    player.movement.prototype.move(game.input.keyboard);
    game.physics.arcade.overlap(player_slime, portal_slime, this.hitPortal);

    player.movement.prototype.attack(game.input.keyboard);
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
