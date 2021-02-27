// State0 will be the titlescreen

var player_slime;
var slime = {};
var player = {};


// attempting slime movement to be handled more nicely
player.accel = 400
player.jump_height = 300;
player.movement = function() {};
// can add attribute here to adjust the jump timer, or acceleration of the slime
player.movement.prototype = {
  move: function(input) {
    if (input.isDown(Phaser.Keyboard.LEFT)) {
      player_slime.body.acceleration.x = -player.accel;
    } else if (input.isDown(Phaser.Keyboard.RIGHT)) {
      player_slime.body.acceleration.x = player.accel;
    } else {
      player_slime.body.acceleration.x = 0;
      player_slime.frame = 0; // this is for animations to return to first frame
    }
    if (input.isDown(Phaser.Keyboard.UP)) {
      player_slime.body.velocity.y = -player.jump_height;
    }
  }
}

slime.state0 = function() {};
slime.state0.prototype = {
  preload: function() {
    game.load.image('slime', 'assets/sprites/slime_static.png');
  },

  create: function() {

    game.stage.backgroundColor = "#dddddd";
    game.physics.startSystem(Phaser.Physics.ARCADE);
    player_slime = game.add.sprite(100, 100, "slime");
    game.physics.enable(player_slime);
    game.world.setBounds(0, 0, 2000, 1000);
    player_slime.body.collideWorldBounds = true;
    player_slime.body.gravity.y = 500;
    player_slime.drag.x = 400;

    //camera
    game.camera.follow(player_slime);

  },

  update: function() {
    player.movement.prototype.move(game.input.keyboard);

  },
}
