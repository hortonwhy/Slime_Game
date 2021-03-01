var bullet;
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
    game.world.setBounds(0, 0, 2000, 1000);

    // physics 
    base_game.prototype.physics(player_slime);
    base_game.prototype.projectile();

    //camera
    game.camera.follow(player_slime);

  },

  update: function() {
    console.log(player_slime.x, player_slime.y);
    player.movement.prototype.move(game.input.keyboard);
    player.movement.prototype.attack(game.input.keyboard);
  },
}
