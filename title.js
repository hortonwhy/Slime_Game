var CenterX = 2000 / 2, CenterY = 1000 / 2;
var volBtn, b1, sound;
var vol_state = 1;
let volume = {};

volume.toggle = function() {};
      volume.toggle.prototype = {
      mute: function (sound) {
      volBtn = game.add.button(1500, 800, 'volume', function() {
      console.log('the button is toggled');
      if ( vol_state == 1) {
        sound.volume = 0;
        vol_state = 0;
        volBtn.frame = 1;
      } else {
        sound.volume = 1;
        vol_state = 1;
        volBtn.frame = 0;
      }
      console.log(sound.volume);
    });
    volBtn.scale.setTo(5);
    volBtn.anchor.x = 0.5;
    volBtn.anchor.y = 0.5;
    volBtn.animations.add('mute', [0, 1]);
      },
    }
slime.title = function() {};
slime.title.prototype = {
  preload: function() {
    game.load.image('startBtn', 'assets/sprites/start_button.jpg');
    //game.load.audio('op-music', 'assets/audio/op.mp3');
    game.load.spritesheet('volume', 'assets/spritesheet/volume.png', 32, 32);
  },

  create: function() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.stage.backgroundColor = "#ff00ff";
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 600, 800);
    sound = game.add.audio('op-music');

    b1 = game.add.button(CenterX, CenterY, 'startBtn', function() {
      changeState(0);
    });
    b1.anchor.setTo(0.5, 0.5);

    volume.toggle.prototype.mute(sound);
    },
  update: function() {
  },
}

function changeState (stateNum) {
  game.state.start('state' + stateNum);
};
