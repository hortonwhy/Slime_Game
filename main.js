var game = new Phaser.Game(2000, 1000, Phaser.AUTO);
var score = 0;

game.state.add('state0', slime.state0);
game.state.add('state1', slime.state1);
game.state.add('title', slime.title_state);
game.state.start('state0',score);
