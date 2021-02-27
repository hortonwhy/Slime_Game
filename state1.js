slime.state1 = function() {};
slime.state1.prototype = {
  preload: function() {

  },

  create: function() {
    game.stage.backgroundColor = "#AAAAAA";
    game.physics.startSystem(Phaser.Physics.ARCADE);

    player_slime = game.add.sprite(100, 100, "slime");
    portal_slime = game.add.sprite(1000, 700, "slime");
    game.physics.enable(portal_slime);
    game.physics.enable(player_slime);
    game.world.setBounds(0, 0, 2000, 1000);
    player_slime.body.collideWorldBounds = true;
    player_slime.body.gravity.y = 500;
    player_slime.body.drag.x = 400;

    //camera
    game.camera.follow(player_slime);

  },

  update: function() {
    player.movement.prototype.move(game.input.keyboard);

  },
}
