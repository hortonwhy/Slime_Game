slime.state1 = function() {};
slime.state1.prototype = {
  preload: function() {

  },

  create: function() {
    game.stage.backgroundColor = "#AAAAAA";

  },

  update: function() {
    slime.movement.prototype.move(game.input.keyboard.isDown(Phaser.Keyboard.LEFT));

  },
}
